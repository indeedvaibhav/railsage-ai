import { useLanguage } from '../contexts/LanguageContext'

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <h3 className="settings-section-title">Language</h3>
        <div className="settings-lang-grid">
          {[
            { code: 'EN', label: 'English' },
            { code: 'HI', label: 'हिंदी' },
            { code: 'JA', label: '日本語' },
          ].map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`settings-lang-btn ${language === l.code ? 'settings-lang-btn--active' : ''}`}
            >
              <span className="settings-lang-code">{l.code}</span>
              <span className="settings-lang-name">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">About</h3>
        <div className="settings-about">
          <p>RailSage AI — India's smartest railway companion</p>
          <p>Built for FAR AWAY Hackathon 2026</p>
          <p>Team: Aditya Dixit & Vaibhav Tripathi</p>
        </div>
      </div>
    </div>
  )
}