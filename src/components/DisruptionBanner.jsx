import { useTrain } from '../contexts/TrainContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BOOTSTRAP_INCIDENT } from '../data/bootstrapData';

export default function DisruptionBanner() {
  const { selectedTrain, trainStatus } = useTrain();
  const { language } = useLanguage();

  const hasTrainDelay = selectedTrain && trainStatus && trainStatus.delayMinutes >= 1;

  if (!hasTrainDelay && !BOOTSTRAP_INCIDENT) return null;

  let severity;
  let title;
  let description;
  let label;

  if (hasTrainDelay) {
    severity = trainStatus.delayMinutes >= 60 ? 'high' : 'moderate';
    title = language === 'hi'
      ? `${selectedTrain.trainName} — ${trainStatus.delayMinutes} मिनट देरी से`
      : language === 'ja'
      ? `${selectedTrain.trainName} — ${trainStatus.delayMinutes}分遅延中`
      : `${selectedTrain.trainName} — Running ${trainStatus.delayMinutes} min late`;
    description = trainStatus.delayReason
      || (language === 'hi' ? 'कारण उपलब्ध नहीं' : language === 'ja' ? '遅延理由：情報なし' : 'Reason not available');
    label = severity === 'high'
      ? (language === 'hi' ? 'भारी देरी' : language === 'ja' ? '大幅遅延' : 'MAJOR DELAY')
      : (language === 'hi' ? 'देरी' : language === 'ja' ? '遅延' : 'DELAY');
  } else {
    severity = BOOTSTRAP_INCIDENT.severity;
    title = BOOTSTRAP_INCIDENT.title[language] || BOOTSTRAP_INCIDENT.title.en;
    description = BOOTSTRAP_INCIDENT.description[language] || BOOTSTRAP_INCIDENT.description.en;
    label = severity === 'high'
      ? (language === 'hi' ? 'सक्रिय घटना' : language === 'ja' ? 'アクティブな障害' : 'ACTIVE INCIDENT')
      : (language === 'hi' ? 'सक्रिय चेतावनी' : language === 'ja' ? 'アクティブな注意' : 'ACTIVE ALERT');
  }

  return (
    <div className="disruption-banner-container">
      <div className={`disruption-banner disruption-${severity}`}>
        <div className="disruption-main">
          <svg className="disruption-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="disruption-content">
            <span className="disruption-label">{label}</span>
            <p className="disruption-title">{title}</p>
            <p className="disruption-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Add disruption banner component */
