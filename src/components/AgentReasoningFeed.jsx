import { useRef, useEffect } from 'react';
import { useAgent } from '../contexts/AgentContext';

const TYPE_ICONS = {
  scan: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  alert: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  weather: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  monitor: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function AgentReasoningFeed() {
  const { reasoningSteps } = useAgent();
  const scrollRef = useRef(null);

  // auto-scroll to bottom on new steps
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [reasoningSteps]);

  return (
    <div className="agent-reasoning-feed">
      <div className="agent-reasoning-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
        <span>AI Reasoning Feed</span>
        <span className="agent-reasoning-count">{reasoningSteps.length} steps</span>
      </div>
      <div className="agent-reasoning-events" ref={scrollRef}>
        {reasoningSteps.map((step) => (
          <div key={step.id} className={`agent-reasoning-event agent-event-${step.type} agent-step-${step.status}`}>
            <span className="agent-event-step-num">{step.step}</span>
            <span className="agent-event-icon">{TYPE_ICONS[step.type] || TYPE_ICONS.monitor}</span>
            <div className="agent-event-body">
              <p className="agent-event-message">
                {step.message}
                {step.status === 'active' && <span className="agent-cursor" />}
              </p>
              <span className="agent-event-time">{formatTime(step.timestamp)}</span>
            </div>
            <span className="agent-step-status-icon">
              {step.status === 'completed' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Create agent reasoning feed UI */

/* Add auto-scroll to reasoning feed */
