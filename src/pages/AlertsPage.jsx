import ScenarioSimulator from '../components/ScenarioSimulator'
import IncidentCard from '../components/IncidentCard'
import AgentReasoningFeed from '../components/AgentReasoningFeed'
import DisruptionBanner from '../components/DisruptionBanner'

export default function AlertsPage() {
  return (
    <div className="alerts-page">
      <DisruptionBanner />
      <div className="alerts-grid">
        <div className="alerts-left">
          <ScenarioSimulator />
          <IncidentCard />
        </div>
        <div className="alerts-right">
          <AgentReasoningFeed />
        </div>
      </div>
    </div>
  )
}