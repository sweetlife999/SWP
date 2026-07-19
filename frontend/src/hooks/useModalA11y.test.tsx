import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useModalA11y, MODAL_A11Y_PROPS } from './useModalA11y'

function Dialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useModalA11y(open, onClose)
  if (!open) return null
  return (
    <div ref={ref} {...MODAL_A11Y_PROPS} aria-label="Тестовый диалог">
      content
    </div>
  )
}

describe('useModalA11y', () => {
  it('exposes dialog semantics', () => {
    render(<Dialog open onClose={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: 'Тестовый диалог' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('moves focus into the dialog on open', () => {
    render(<Dialog open onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    render(<Dialog open onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not listen for Escape while closed', () => {
    const onClose = vi.fn()
    render(<Dialog open={false} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not steal focus back from an input on every keystroke', async () => {
    // Mirrors the real admin "add" forms: onClose is an inline closure that
    // gets a new identity on every parent re-render (each keystroke updates
    // form state). Before the fix, that retriggered the focus effect and
    // yanked focus from the input back to the dialog container.
    function FormInModal() {
      const [value, setValue] = useState('')
      const ref = useModalA11y(true, () => setValue(''))
      return (
        <div ref={ref} {...MODAL_A11Y_PROPS} aria-label="Форма">
          <input aria-label="Название" value={value} onChange={e => setValue(e.target.value)} />
        </div>
      )
    }

    const user = userEvent.setup()
    render(<FormInModal />)

    const input = screen.getByLabelText('Название')
    await user.click(input)
    await user.type(input, 'test')

    expect(input).toHaveFocus()
    expect(input).toHaveValue('test')
  })
})
