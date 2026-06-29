import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MobileTabBar from '../components/MobileTabBar'

export default function AppLayout() {
  return (
    <div className="app-shell">
      {/* Top navbar — hidden on mobile */}
      <Navbar />

      {/* Page content */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Bottom tab bar — hidden on desktop */}
      <MobileTabBar />
    </div>
  )
}