import { useLanguage } from '../contexts/LanguageContext';
import { useTrain } from '../contexts/TrainContext';
import TrainStatusCard from './TrainStatusCard';

export default function Sidebar({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const { recentTrains, selectTrain, selectedTrain } = useTrain();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {t('sidebarTitle')}
          </h2>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Global Map Option */}
        <div className="sidebar-tabs" style={{ padding: '0 1rem', marginTop: '1rem', borderBottom: 'none' }}>
          <button
            className={`sidebar-tab ${!selectedTrain ? 'sidebar-tab-active' : ''}`}
            onClick={() => { selectTrain(null); onClose(); }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {language === 'hi' ? 'लाइव ग्लोबल मैप देखें' : language === 'ja' ? 'ライブグローバルマップを見る' : 'View Live Global Map'}
          </button>
        </div>

        {/* Content */}
        <div className="sidebar-content" style={{ marginTop: '0.5rem' }}>
          <div className="sidebar-trains">
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', padding: '0 1rem', marginBottom: '0.75rem' }}>
              {language === 'hi' ? 'हाल की ट्रेनें' : language === 'ja' ? '最近の列車' : 'Recent Trains'}
            </h3>
            {recentTrains.length === 0 ? (
              <div className="sidebar-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="sidebar-empty-icon">
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="14" />
                  <circle cx="12" cy="17" r="0.5" />
                </svg>
                <p>{t('noTrainsFound')}</p>
              </div>
            ) : (
              recentTrains.map((train) => (
                <TrainStatusCard
                  key={train.trainNumber}
                  train={train}
                  onClick={() => { selectTrain(train); onClose(); }}
                  compact
                />
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* Create Sidebar component shell */
