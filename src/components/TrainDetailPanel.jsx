import { useTrain } from '../contexts/TrainContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDelay } from '../services/trainService';

export default function TrainDetailPanel() {
  const { selectedTrain, trainStatus, weather } = useTrain();
  const { language } = useLanguage();

  const train = selectedTrain;
  if (!train) {
    return (
      <div className="train-detail-panel train-detail-empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
        <p>Select a train to view details</p>
      </div>
    );
  }

  const delayColor = train.delayMinutes > 30 ? 'var(--red-400)' : train.delayMinutes > 0 ? 'var(--amber-400)' : 'var(--emerald-400)';
  const delayText = train.delayMinutes > 0 ? formatDelay(train.delayMinutes, language) : (language === 'hi' ? 'समय पर' : language === 'ja' ? '定刻' : 'On Time');

  const boxes = [
    {
      label: 'Train',
      value: `${train.trainNumber} — ${train.trainName}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="3" width="16" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="14" /><circle cx="12" cy="17" r="0.5" />
        </svg>
      ),
    },
    {
      label: 'Route',
      value: `${train.from} → ${train.to}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
        </svg>
      ),
    },
    {
      label: 'Current Station',
      value: train.currentStation || '—',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: 'Platform',
      value: train.platform ? `Platform ${train.platform}` : '—',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3l-4 4-4-4" />
        </svg>
      ),
    },
    {
      label: 'Delay Status',
      value: delayText,
      color: delayColor,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Last Updated',
      value: train.lastUpdated ? new Date(train.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Live',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="train-detail-panel">
      <div className="train-detail-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span>Train Details</span>
      </div>
      <div className="train-detail-boxes">
        {boxes.map((box, i) => (
          <div key={i} className="train-detail-box">
            <div className="train-detail-box-icon">{box.icon}</div>
            <div className="train-detail-box-content">
              <span className="train-detail-box-label">{box.label}</span>
              <span className="train-detail-box-value" style={box.color ? { color: box.color } : undefined}>
                {box.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Create train detail panel */

/* Wire train selection to detail panel */
