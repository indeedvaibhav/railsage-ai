import { useState } from 'react';
import { useAgent } from '../contexts/AgentContext';

export default function IncidentCard() {
  const { incident, approveIncident, overrideIncident, overrideInput, showOverrideInput, hideOverrideInput } = useAgent();
  const [alternativeText, setAlternativeText] = useState('');

  if (!incident) return null;

  const isResolved = incident.status === 'RESOLVED';

  const handleOverrideSubmit = () => {
    if (alternativeText.trim()) {
      overrideIncident(alternativeText.trim());
      setAlternativeText('');
    }
  };

  return (
    <div className={`incident-card ${isResolved ? 'incident-resolved' : 'incident-active'}`}>
      <div className="incident-header">
        <div className="incident-title-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="incident-title">{incident.title}</span>
        </div>
        <span className={`incident-status-badge ${isResolved ? 'incident-badge-resolved' : 'incident-badge-active'}`}>
          {incident.status}
        </span>
      </div>

      <p className="incident-description">{incident.description}</p>
      <p className="incident-zone">{incident.zone}</p>

      {!isResolved && (
        <div className="incident-actions">
          <button className="incident-btn incident-btn-approve" onClick={approveIncident} id="incident-approve-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            APPROVE
          </button>
          <button className="incident-btn incident-btn-override" onClick={showOverrideInput} id="incident-override-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            OVERRIDE
          </button>
        </div>
      )}

      {overrideInput && !isResolved && (
        <div className="incident-override-input">
          <input
            type="text"
            className="override-text-input"
            placeholder="Enter your preferred alternative..."
            value={alternativeText}
            onChange={(e) => setAlternativeText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleOverrideSubmit(); }}
            autoFocus
            id="override-text-field"
          />
          <div className="override-input-actions">
            <button className="override-submit-btn" onClick={handleOverrideSubmit} disabled={!alternativeText.trim()}>Submit</button>
            <button className="override-cancel-btn" onClick={hideOverrideInput}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Create incident card component */

/* Add approve and override functionality */
