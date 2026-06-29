import { NavLink } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { path: '/tracker',   label: 'Tracker',   icon: '🗺️' },
  { path: '/journey',   label: 'Journey',   icon: '🧭' },
  { path: '/alerts',    label: 'Alerts',    icon: '⚠️' },
  { path: '/chat',      label: 'Chat',      icon: '💬' },
]

export default function Navbar() {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <span className="navbar-logo-text">RailSage</span>
        <span className="navbar-logo-accent"> AI</span>
      </div>

      {/* Nav links */}
      <nav className="navbar-links">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'navbar-link--active' : ''}`
            }
          >
            <span className="navbar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right side: language + settings */}
      <div className="navbar-right">
        <div className="lang-toggle">
          {['EN', 'HI', 'JA'].map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`lang-btn ${language === lang ? 'lang-btn--active' : ''}`}
            >
              {lang}
            </button>
          ))}
        </div>
        <NavLink to="/settings" className="navbar-settings-btn">
          ⚙️
        </NavLink>
      </div>
    </header>
  )
}