import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Inspections } from './pages/Inspections'
import { Enterprises } from './pages/Enterprises'
import { Profile } from './pages/Profile'
import { currentUser } from './data/mockUser'
import { canFilterEnterprises } from './types/user'

function EnterprisesRoute() {
  if (!canFilterEnterprises(currentUser.role)) {
    return <Navigate to="/" replace />
  }
  return <Enterprises />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="enterprises" element={<EnterprisesRoute />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
