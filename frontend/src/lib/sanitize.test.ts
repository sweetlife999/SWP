import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('strips script tags and inline event handlers', () => {
    const dirty = '<p onclick="alert(1)">hi</p><script>alert(2)</script><img src="x" onerror="alert(3)">'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('onclick')
    expect(clean).toContain('<p>hi</p>')
  })

  it('keeps allowed formatting tags intact', () => {
    const html = '<ul><li><strong>a</strong></li></ul>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('strips javascript: URLs from links', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:')
  })
})
