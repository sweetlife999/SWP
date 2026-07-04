import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface AdminCtx {
  isAdmin: boolean
  token: string
  login: (t: string) => void
  logout: () => void
}

const Ctx = createContext<AdminCtx>({ isAdmin: false, token: '', login: () => {}, logout: () => {} })

/**
 * Decodes the JWT payload (middle base64 segment) without verifying the signature
 * — signature verification happens on the server. We only read the `exp` claim here
 * to avoid showing the admin UI with a token the server would reject anyway.
 *
 * Returns false for any malformed token so callers never need to handle exceptions.
 */
function isTokenValid(token: string): boolean {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>(() => {
    const stored = localStorage.getItem('su_admin_token') ?? ''
    // Evict an expired token immediately on app load so stale state never leaks
    // into the UI. Without this, isAdmin would be true until the first API call
    // returned 401.
    if (stored && !isTokenValid(stored)) {
      localStorage.removeItem('su_admin_token')
      return ''
    }
    return stored
  })

  function login(t: string) {
    localStorage.setItem('su_admin_token', t)
    setToken(t)
  }

  function logout() {
    localStorage.removeItem('su_admin_token')
    setToken('')
  }

  // api.ts dispatches this when a request comes back 401 (e.g. the token
  // expired mid-session). Without this, a button click that only updates
  // local page state never re-renders this provider, so isAdmin would stay
  // true and the page would just show a stuck generic error instead of
  // sending the admin back to the login screen.
  useEffect(() => {
    window.addEventListener('su:unauthorized', logout)
    return () => window.removeEventListener('su:unauthorized', logout)
  }, [])

  // Re-derive isAdmin from the token on every render so it goes false the moment
  // the token expires mid-session (e.g. a tab left open overnight).
  return (
    <Ctx.Provider value={{ isAdmin: isTokenValid(token), token, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdmin = () => useContext(Ctx)
