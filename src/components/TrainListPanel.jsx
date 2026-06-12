import { useTrain } from '../contexts/TrainContext';
import { getStatusInfo, formatDelay } from '../services/trainService';
import { useLanguage } from '../contexts/LanguageContext';

export default function TrainListPanel() {
  const { allTrains, selectTrain, selectedTrain } = useTrain();
  const { language } = useLanguage();

  return (
    <div className="train-list-panel">
      <div className="train-list-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="12" y1="8" x2="12" y2="14" />
          <circle cx="12" cy="17" r="0.5" />
        </svg>
        <span>Active Trains</span>
        <span className="train-list-count">{allTrains.length}</span>
      </div>
      <div className="train-list-items">
        {allTrains.slice(0, 5).map((train) => {
          const isSelected = selectedTrain?.trainNumber === train.trainNumber;
          const statusInfo = getStatusInfo(train.status || 'on_time', language);
          const delayColor = train.delayMinutes > 30 ? 'var(--red-400)' : train.delayMinutes > 0 ? 'var(--amber-400)' : 'var(--emerald-400)';

          return (
            <button
              key={train.trainNumber}
              className={`train-list-item ${isSelected ? 'train-list-item-selected' : ''}`}
              onClick={() => selectTrain(train)}
              id={`train-list-${train.trainNumber}`}
            >
              <div className="train-list-item-left">
                <span className="train-list-number">{train.trainNumber}</span>
                <span className="train-list-name">{train.trainName}</span>
                <span className="train-list-route">{train.from} → {train.to}</span>
              </div>
              <div className="train-list-item-right">
                <span className={`train-list-status-badge ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                  {statusInfo.label}
                </span>
                {train.delayMinutes > 0 && (
                  <span className="train-list-delay" style={{ color: delayColor }}>
                    {formatDelay(train.delayMinutes, language)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Setup train list panel */

/* Populate train list with live data */

/* Add color-coded delay badges */

/* Fix missing key props on list renders */
