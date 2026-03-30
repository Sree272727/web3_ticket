import { Navigate, Route, Routes } from 'react-router-dom';
import { PersonaProvider } from './context/PersonaContext';
import AppShell from './components/AppShell/AppShell';
import SupportPortalPage from './pages/Support/SupportPortalPage';
import NotificationCenterPage from './pages/NotificationCenter/NotificationCenterPage';
import AdminConsolePage from './pages/AdminConsole/AdminConsolePage';
import ReportingDashboardPage from './pages/ReportingDashboard/ReportingDashboardPage';
import './style/variables.css';
import './style/base.css';
import './style/components.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/support" replace />} />
      <Route element={<PersonaProvider><AppShell /></PersonaProvider>}>
        <Route path="/support" element={<SupportPortalPage />} />
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/admin" element={<AdminConsolePage />} />
        <Route path="/reporting" element={<ReportingDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/support" replace />} />
    </Routes>
  );
}
