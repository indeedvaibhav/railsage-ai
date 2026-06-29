import TrainMap from '../components/TrainMap'
import TrainListPanel from '../components/TrainListPanel'
import TrainDetailPanel from '../components/TrainDetailPanel'

export default function TrackerPage() {
  return (
    <div className="tracker-layout">
      <div className="tracker-map">
        <TrainMap />
      </div>
      <div className="tracker-sidebar">
        <TrainListPanel />
        <TrainDetailPanel />
      </div>
    </div>
  )
}