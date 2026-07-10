import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from './api'

// Minimal Response stand-in: req()/reqVoid() only touch status, ok, and text().
function fakeResponse(status: number, body = ''): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => body,
  } as unknown as Response
}

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the stored token as a Bearer Authorization header', async () => {
    localStorage.setItem('su_admin_token', 'tok123')
    const fetchMock = vi.fn().mockResolvedValue(fakeResponse(200, '[]'))
    vi.stubGlobal('fetch', fetchMock)

    await api.admin.forms.list()

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/admin/forms')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok123')
  })

  it('dispatches su:unauthorized and drops the token when an authed request gets 401', async () => {
    localStorage.setItem('su_admin_token', 'tok123')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse(401)))
    const handler = vi.fn()
    window.addEventListener('su:unauthorized', handler)

    await expect(api.admin.forms.list()).rejects.toThrow('401')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('su_admin_token')).toBeNull()
    window.removeEventListener('su:unauthorized', handler)
  })

  it('does not treat a wrong-password 401 from login as session expiry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse(401)))
    const handler = vi.fn()
    window.addEventListener('su:unauthorized', handler)

    await expect(api.admin.login('wrong')).rejects.toThrow('401')

    expect(handler).not.toHaveBeenCalled()
    window.removeEventListener('su:unauthorized', handler)
  })
})
