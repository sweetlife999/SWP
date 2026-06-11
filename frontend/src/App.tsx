import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import MembersPage from './pages/MembersPage'
import QuestionnairesPage from './pages/QuestionnairesPage'
import DonationsPage from './pages/DonationsPage'
import KanbanPage from './pages/KanbanPage'
import FormBuilderPage from './pages/FormBuilderPage'
import AdminAccountsPage from './pages/AdminAccountsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/questionnaires" element={<QuestionnairesPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/admin/kanban" element={<KanbanPage />} />
        <Route path="/admin/forms/builder" element={<FormBuilderPage />} />
        <Route path="/admin/accounts" element={<AdminAccountsPage />} />
      </Route>
    </Routes>
  )
}
