import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../lib/AdminContext'

/**
 * Layout route that gates all child routes behind admin authentication.
 * Renders the matched child route when the JWT is present and valid;
 * redirects to /admin/login (replacing history so Back doesn't loop) otherwise.
 *
 * Usage in the router: wrap admin routes in a <Route element={<ProtectedRoute />}>
 * group — the AppShell above it still renders, so the layout is preserved on redirect.
 */
export default function ProtectedRoute() {
  const { isAdmin } = useAdmin()
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />
}
