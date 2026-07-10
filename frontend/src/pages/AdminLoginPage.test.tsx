import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminLoginPage from './AdminLoginPage'
import { AdminProvider } from '../lib/AdminContext'
import { api } from '../lib/api'

vi.mock('../lib/api', () => ({
  api: {
    admin: {
      login: vi.fn(),
      logout: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

function makeToken(expOffsetSec: number): string {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expOffsetSec }))
  return `header.${payload}.signature`
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminProvider>
        <AdminLoginPage />
      </AdminProvider>
    </MemoryRouter>,
  )
}

describe('AdminLoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('logs in with the entered password and stores the token', async () => {
    const token = makeToken(3600)
    vi.mocked(api.admin.login).mockResolvedValue({ token })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Пароль'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(api.admin.login).toHaveBeenCalledWith('secret123')
    await waitFor(() => expect(localStorage.getItem('su_admin_token')).toBe(token))
  })

  it('shows an error message when login fails', async () => {
    vi.mocked(api.admin.login).mockRejectedValue(new Error('401'))
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Пароль'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Неверный пароль или ошибка сервера')).toBeInTheDocument()
    expect(localStorage.getItem('su_admin_token')).toBeNull()
  })

  it('disables the submit button until a password is entered', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled()
  })
})
