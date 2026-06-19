import { Routes, Route } from 'react-router-dom'
import { AdminProvider } from './lib/AdminContext'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import MembersPage from './pages/MembersPage'
import QuestionnairesPage from './pages/QuestionnairesPage'
import DonationsPage from './pages/DonationsPage'
import KanbanPage from './pages/KanbanPage'
import FormBuilderPage from './pages/FormBuilderPage'
import FormsViewerPage from './pages/FormsViewerPage'
import EventsManagementPage from './pages/EventsManagementPage'
import AdminLoginPage from './pages/AdminLoginPage'

export default function App() {
  return (
    // AdminProvider holds the JWT and exposes isAdmin to the whole tree.
    // It must wrap Routes so ProtectedRoute can read context during the
    // initial render before any navigation happens.
    <AdminProvider>
      <Routes>
        {/* Login sits outside AppShell — it has its own minimal layout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AppShell />}>
          {/* Public routes — no auth required */}
          <Route path="/" element={<HomePage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/questionnaires" element={<QuestionnairesPage />} />
          <Route path="/donations" element={<DonationsPage />} />

          {/* Admin routes — ProtectedRoute redirects to /admin/login if not authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/kanban" element={<KanbanPage />} />
            <Route path="/admin/forms/builder" element={<FormBuilderPage />} />
            <Route path="/admin/forms/viewer" element={<FormsViewerPage />} />
          </Route>
        </Route>
      </Routes>
    </AdminProvider>
  )
}
