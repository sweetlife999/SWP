import { createContext, useContext, useState, type ReactNode } from 'react'

interface AdminCtx {
  isAdmin: boolean
  token: string
  login: (t: string) => void
  logout: () => void
}

const Ctx = createContext<AdminCtx>({ isAdmin: false, token: '', login: () => {}, logout: () => {} })

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('su_admin_token') ?? '')

  function login(t: string) {
    localStorage.setItem('su_admin_token', t)
    setToken(t)
  }
  function logout() {
    localStorage.removeItem('su_admin_token')
    setToken('')
  }

  return <Ctx.Provider value={{ isAdmin: !!token, token, login, logout }}>{children}</Ctx.Provider>
}

export const useAdmin = () => useContext(Ctx)
