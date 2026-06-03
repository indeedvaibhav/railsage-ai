import { useAgent } from '../contexts/AgentContext';

const SCENARIO_BUTTONS = [
  { key: 'signal_failure', label: 'Signal Failure', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  )},
  { key: 'storm', label: 'Cyclone Warning', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )},
  { key: 'track_block', label: 'Track Block', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  )},
  { key: 'crowd_surge', label: 'Crowd Surge', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )},
];

export default function ScenarioSimulator() {
  const { triggerScenario, activeScenario } = useAgent();

  return (
    <div className="scenario-simulator">
      <div className="scenario-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span>Scenario Simulator</span>
      </div>
      <div className="scenario-buttons">
        {SCENARIO_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            className={`scenario-btn ${activeScenario === btn.key ? 'scenario-btn-active' : ''}`}
            onClick={() => triggerScenario(btn.key)}
            id={`scenario-${btn.key}`}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Create scenario simulator shell */
