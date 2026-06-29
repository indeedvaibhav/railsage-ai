import { NavLink } from 'react-router-dom'

const tabs = [
  { path: '/dashboard', label: 'Home',    icon: '⚡' },
  { path: '/tracker',   label: 'Tracker', icon: '🗺️' },
  { path: '/journey',   label: 'Journey', icon: '🧭' },
  { path: '/alerts',    label: 'Alerts',  icon: '⚠️' },
  { path: '/chat',      label: 'Chat',    icon: '💬' },
]

export default function MobileTabBar() {
  return (
    <nav className="mobile-tabbar">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `tab-item ${isActive ? 'tab-item--active' : ''}`
          }
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}