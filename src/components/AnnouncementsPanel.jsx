import { useState } from 'react';
import { useAgent } from '../contexts/AgentContext';

export default function AnnouncementsPanel() {
  const { announcements } = useAgent();
  const [sentMap, setSentMap] = useState({});

  const handleBroadcast = (id) => {
    setSentMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="announcements-panel">
      <div className="announcements-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Multilingual Announcements</span>
      </div>
      <div className="announcements-list">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="announcement-card"
            style={{ '--flag-color': ann.flagColor }}
          >
            <div className="announcement-card-header">
              <span className="announcement-flag">{ann.flag}</span>
              <span className="announcement-title">{ann.title}</span>
              <span className="announcement-lang-badge">
                {ann.language === 'en' ? 'ENG' : ann.language === 'hi' ? 'HIN' : 'JPN'}
              </span>
            </div>
            <p className="announcement-text">{ann.text}</p>
            <button
              className={`announcement-broadcast-btn ${sentMap[ann.id] ? 'broadcast-sent' : ''}`}
              onClick={() => handleBroadcast(ann.id)}
              disabled={sentMap[ann.id]}
              id={`broadcast-${ann.id}`}
            >
              {sentMap[ann.id] ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  SENT
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  BROADCAST
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Implement multilingual announcements panel */

/* Add broadcast action to announcements */

/* Fix missing key props on list renders */
