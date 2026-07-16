import { useEffect, useRef } from 'react'

/**
 * Static ARIA attributes for a modal dialog container; spread onto the
 * dialog div alongside the ref from useModalA11y and an aria-label.
 */
export const MODAL_A11Y_PROPS = {
  role: 'dialog',
  'aria-modal': true,
  tabIndex: -1,
} as const

/**
 * Shared a11y wiring for modal overlays: closes on Escape and moves focus
 * into the dialog when it opens (a lightweight stand-in for full focus
 * trapping — sufficient since these modals are simple forms, not nested
 * flows). Attach the returned ref to the dialog container div.
 */
export function useModalA11y(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  // Keep the latest onClose in a ref so it doesn't have to be an effect
  // dependency — callers that pass an inline closure (recreated on every
  // parent re-render, e.g. on each keystroke in a form inside the modal)
  // would otherwise retrigger this effect and steal focus back to the
  // dialog container on every render.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    ref.current?.focus()
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  return ref
}
