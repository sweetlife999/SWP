import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { AdminProvider, useAdmin } from './AdminContext'
import { api } from './api'

vi.mock('./api', () => ({
  api: { admin: { logout: vi.fn().mockResolvedValue(undefined) } },
}))

// Unsigned JWT-shaped token: AdminContext only reads the exp claim client-side.
function makeToken(expOffsetSec: number): string {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expOffsetSec }))
  return `header.${payload}.signature`
}

function Probe() {
  const { isAdmin, login, logout } = useAdmin()
  return (
    <div>
      <span data-testid="is-admin">{String(isAdmin)}</span>
      <button onClick={() => login(makeToken(3600))}>do-login</button>
      <button onClick={logout}>do-logout</button>
    </div>
  )
}

function renderProbe() {
  return render(
    <AdminProvider>
      <Probe />
    </AdminProvider>,
  )
}

describe('AdminContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('is not admin without a token', () => {
    renderProbe()
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
  })

  it('evicts an expired token on load', () => {
    localStorage.setItem('su_admin_token', makeToken(-100))
    renderProbe()
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
    expect(localStorage.getItem('su_admin_token')).toBeNull()
  })

  it('login stores the token and grants isAdmin', () => {
    renderProbe()
    fireEvent.click(screen.getByText('do-login'))
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true')
    expect(localStorage.getItem('su_admin_token')).not.toBeNull()
  })

  it('logout clears the token and revokes the session server-side', () => {
    localStorage.setItem('su_admin_token', makeToken(3600))
    renderProbe()
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true')
    fireEvent.click(screen.getByText('do-logout'))
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
    expect(localStorage.getItem('su_admin_token')).toBeNull()
    expect(api.admin.logout).toHaveBeenCalledTimes(1)
  })

  it('logs out when api dispatches su:unauthorized (expired mid-session)', () => {
    localStorage.setItem('su_admin_token', makeToken(3600))
    renderProbe()
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true')
    act(() => {
      window.dispatchEvent(new Event('su:unauthorized'))
    })
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
  })
})
