import { useLanguage } from '../contexts/LanguageContext';
import { useTrain } from '../contexts/TrainContext';
import { getStatusInfo, formatDelay } from '../services/trainService';

export default function TrainStatusCard({ train, onClick, compact = false }) {
  const { language, t } = useLanguage();
  const { selectedTrain } = useTrain();
  const statusInfo = getStatusInfo(train.status, language);
  const isSelected = selectedTrain?.trainNumber === train.trainNumber;

  return (
    <button
      className={`train-card ${isSelected ? 'train-card-selected' : ''} ${compact ? 'train-card-compact' : ''}`}
      onClick={onClick}
      id={`train-card-${train.trainNumber}`}
    >
      {/* Header row */}
      <div className="train-card-header">
        <div className="train-card-number-name">
          <span className="train-card-number">{train.trainNumber}</span>
          <span className="train-card-name">{train.trainName}</span>
        </div>
        <span className={`train-status-badge ${statusInfo.bgClass} ${statusInfo.textClass}`}>
          <span className={`status-dot ${statusInfo.dotClass} ${train.status === 'delayed' ? 'status-dot-pulse' : ''} ${train.status === 'cancelled' ? 'status-dot-pulse-red' : ''}`} />
          {statusInfo.label}
        </span>
      </div>

      {/* Route */}
      <div className="train-card-route">
        <div className="route-station">
          <span className="route-code">{train.from}</span>
          <span className="route-time">{train.scheduledDeparture}</span>
        </div>
        <div className="route-arrow">
          <div className="route-line" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        <div className="route-station">
          <span className="route-code">{train.to}</span>
          <span className="route-time">{train.expectedArrival || train.scheduledArrival}</span>
        </div>
      </div>

      {/* Delay chip (always visible in compact) */}
      {train.delayMinutes > 0 && (
        <div className="train-card-delay-chip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatDelay(train.delayMinutes, language)}
        </div>
      )}

      {/* Expanded details when selected */}
      {isSelected && (
        <div className="train-card-details">
          {train.delayReason && (
            <div className="train-card-delay">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="delay-reason">{train.delayReason}</span>
            </div>
          )}

          {train.currentStation && (
            <div className="train-card-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{t('currentlyAt')}: <strong>{train.currentStation}</strong></span>
            </div>
          )}

          {train.platform && (
            <div className="train-card-platform">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3l-4 4-4-4" />
              </svg>
              <span>{t('platform')}: <strong>{train.platform}</strong></span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
