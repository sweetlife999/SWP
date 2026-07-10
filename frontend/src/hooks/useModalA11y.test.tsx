import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
})
