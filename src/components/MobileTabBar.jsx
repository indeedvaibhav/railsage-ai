const TABS = [
  {
    key: 'map',
    label: 'Map',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    key: 'feed',
    label: 'AI Feed',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    key: 'announcements',
    label: 'Alerts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function MobileTabBar({ activeTab, onTabChange }) {
  return (
    <nav className="mobile-tab-bar" aria-label="Dashboard navigation">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`mobile-tab ${activeTab === tab.key ? 'mobile-tab-active' : ''}`}
          onClick={() => onTabChange(tab.key)}
          id={`mobile-tab-${tab.key}`}
          aria-selected={activeTab === tab.key}
        >
          {tab.icon}
          <span className="mobile-tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* Add mobile tab bar shell */
