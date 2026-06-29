import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStatusBar from './DashboardStatusBar';
import DisruptionBanner from './DisruptionBanner';
import { useAgent } from '../contexts/AgentContext';
import { useTrain } from '../contexts/TrainContext';
import { BOOTSTRAP_TRAINS } from '../data/bootstrapData';

function Dashboard() {
  const navigate = useNavigate();
  const { metrics, isRunning } = useAgent();
  const { setSelectedTrain } = useTrain();

  const quickActions = [
    { icon: '🗺️', label: 'Track a Train',    sub: 'Live positions & status',  path: '/tracker' },
    { icon: '🧭', label: 'Plan Journey',      sub: 'Find routes & timings',    path: '/journey' },
    { icon: '⚠️', label: 'View Alerts',       sub: 'Incidents & AI reasoning', path: '/alerts'  },
    { icon: '💬', label: 'Ask RailSage',      sub: 'Chat with AI assistant',   path: '/chat'    },
  ];

  return (
    <div className="dashboard-page">
      {/* Scanline overlay */}
      <div className="scanline-overlay" aria-hidden="true" />

      {/* Status bar — clock, KPIs, agent status */}
      <DashboardStatusBar />

      {/* Active disruption alert */}
      <DisruptionBanner />

      <div className="dashboard-content">

        {/* Network health summary */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-title">Network Overview</span>
            <span className={`dash-agent-badge ${isRunning ? 'dash-agent-badge--active' : ''}`}>
              <span className="dash-agent-dot" />
              Agent {isRunning ? 'Active' : 'Paused'}
            </span>
          </div>

          <div className="dash-health-grid">
            <div className="dash-health-card dash-health-card--cyan">
              <span className="dash-health-value">{metrics.activeTrains}</span>
              <span className="dash-health-label">Active Trains</span>
            </div>
            <div className="dash-health-card dash-health-card--green">
              <span className="dash-health-value">{metrics.onTimePercent}%</span>
              <span className="dash-health-label">On Time</span>
            </div>
            <div className="dash-health-card dash-health-card--amber">
              <span className="dash-health-value">{metrics.delayedPercent}%</span>
              <span className="dash-health-label">Delayed</span>
            </div>
            <div className="dash-health-card dash-health-card--red">
              <span className="dash-health-value">{metrics.incidents}</span>
              <span className="dash-health-label">Incidents</span>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-title">Quick Actions</span>
          </div>
          <div className="dash-actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.path}
                className="dash-action-card"
                onClick={() => navigate(action.path)}
              >
                <span className="dash-action-icon">{action.icon}</span>
                <span className="dash-action-label">{action.label}</span>
                <span className="dash-action-sub">{action.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent trains — top 4 only */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-title">Active Trains</span>
            <button
              className="dash-see-all"
              onClick={() => navigate('/tracker')}
            >
              See all →
            </button>
          </div>

          <div className="dash-trains-list">
            {BOOTSTRAP_TRAINS.slice(0, 4).map((train) => (
              <button
                key={train.trainNumber}
                className="dash-train-card"
                onClick={() => {
                  setSelectedTrain(train);
                  navigate('/tracker');
                }}
              >
                <div className="dash-train-left">
                  <span className="dash-train-number">{train.trainNumber}</span>
                  <span className="dash-train-name">{train.trainName}</span>
                  <span className="dash-train-route">
                    {train.from} → {train.to}
                  </span>
                </div>
                <div className="dash-train-right">
                  <span className={`dash-train-status dash-train-status--${
                    train.status === 'on-time' ? 'green'
                    : train.status === 'delayed' ? 'amber'
                    : 'red'
                  }`}>
                    {train.status === 'on-time' ? 'ON TIME'
                      : train.status === 'delayed' ? `+${train.delayMinutes}m`
                      : 'CANCELLED'}
                  </span>
                  {train.currentStation && (
                    <span className="dash-train-station">@ {train.currentStation}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default memo(Dashboard);