import { useState, useEffect, useRef } from 'react';
import { useAgent } from '../contexts/AgentContext';

const TIMEZONES = [
  { key: 'IST', label: 'IST', offset: 5.5 },
  { key: 'JST', label: 'JST', offset: 9 },
  { key: 'UTC', label: 'UTC', offset: 0 },
];

function getTimeInTimezone(date, offsetHours) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + offsetHours * 3600000);
}

function formatClock(date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/* ease-out cubic for count-up */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) { setValue(target); return; }
    mountedRef.current = true;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // After initial animation, sync with live target
  useEffect(() => {
    if (mountedRef.current) setValue(target);
  }, [target]);

  return value;
}

export default function DashboardStatusBar() {
  const { metrics, isRunning } = useAgent();
  const [now, setNow] = useState(() => new Date());
  const [timezone, setTimezone] = useState('IST');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tz = TIMEZONES.find((t) => t.key === timezone) || TIMEZONES[0];
  const tzDate = getTimeInTimezone(now, tz.offset);

  const activeTrains = useCountUp(metrics.activeTrains);
  const onTimePercent = useCountUp(metrics.onTimePercent);
  const delayedPercent = useCountUp(metrics.delayedPercent);
  const incidents = useCountUp(metrics.incidents);

  return (
    <div className="dashboard-status-bar">
      <div className="status-bar-left">
        <div className="status-clock">
          <span className="status-clock-time">{formatClock(tzDate)}</span>
          <span className="status-clock-date">{formatDate(tzDate)} {tz.key}</span>
        </div>
        <div className="status-tz-toggle">
          {TIMEZONES.map((t) => (
            <button
              key={t.key}
              className={`status-tz-btn ${timezone === t.key ? 'status-tz-active' : ''}`}
              onClick={() => setTimezone(t.key)}
              id={`tz-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={`status-agent-pill ${isRunning ? 'status-agent-active' : ''}`}>
          <span className="status-agent-dot" />
          AGENT {isRunning ? 'ACTIVE' : 'PAUSED'}
        </div>
      </div>

      <div className="status-bar-metrics">
        <div className="status-metric status-metric-border-cyan">
          <span className="status-metric-value">{activeTrains}</span>
          <span className="status-metric-label">Active Trains</span>
        </div>
        <div className="status-metric status-metric-border-green">
          <span className="status-metric-value status-metric-good">{onTimePercent}%</span>
          <span className="status-metric-label">On Time</span>
        </div>
        <div className="status-metric status-metric-border-amber">
          <span className="status-metric-value status-metric-warn">{delayedPercent}%</span>
          <span className="status-metric-label">Delayed</span>
        </div>
        <div className="status-metric status-metric-border-red">
          <span className="status-metric-value status-metric-alert">{incidents}</span>
          <span className="status-metric-label">Incidents</span>
        </div>
      </div>
    </div>
  );
}

/* Create dashboard status bar */

/* Add live clock to status bar */

/* Implement timezone toggles (IST/JST/UTC) */

/* Enhance status bar with count-up animations */
