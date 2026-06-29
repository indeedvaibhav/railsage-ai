import { useState, useRef } from 'react'
import TrainMap from '../components/TrainMap'
import { useTrain } from '../contexts/TrainContext'
import { useNavigate } from 'react-router-dom'

export default function TrackerPage() {
  const {
    allTrains, selectedTrain, trainStatus,
    trainSchedule, weather, loading, error,
    search, selectTrain
  } = useTrain()

  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  async function handleSearch(e) {
    const val = e.target.value
    setQuery(val)
    if (val.length < 2) { setResults([]); setShowResults(false); return }
    const found = await search(val)
    setResults(found || [])
    setShowResults(true)
  }

  function handleSelect(train) {
    selectTrain(train)
    setQuery(`${train.trainNumber} — ${train.trainName}`)
    setShowResults(false)
    setResults([])
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setShowResults(false)
    searchRef.current?.focus()
  }

  // Build upcoming stations from live schedule
  const upcomingStations = trainSchedule?.stations
    ?.filter(s => s.status === 'upcoming' || s.status === 'current')
    ?.slice(0, 5) || []

  // Passed stations count
  const passedCount = trainSchedule?.stations
    ?.filter(s => s.status === 'passed')?.length || 0

  // Total stations
  const totalStations = trainSchedule?.stations?.length || 0

  // Delay color
  const delayMinutes = selectedTrain?.delayMinutes || 0
  const delayColor = delayMinutes > 30 ? '#ef4444'
    : delayMinutes > 0 ? '#f59e0b' : '#22c55e'

  // Status label
  const statusLabel = delayMinutes > 0
    ? `Delayed by ${delayMinutes} min`
    : 'On Time'

  return (
    <div className="tracker-page">

      {/* ── LEFT: Map ────────────────────────────────── */}
      <div className="tracker-map-pane">
        <TrainMap />
      </div>

      {/* ── RIGHT: Search + Detail ───────────────────── */}
      <div className="tracker-detail-pane">

        {/* Search */}
        <div className="tracker-search-wrap">
          <div className="tracker-search-box">
            <svg className="tracker-search-icon" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchRef}
              className="tracker-search-input"
              placeholder="Search train number or name..."
              value={query}
              onChange={handleSearch}
              onFocus={() => results.length > 0 && setShowResults(true)}
            />
            {query && (
              <button className="tracker-search-clear" onClick={handleClear}>✕</button>
            )}
          </div>

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <div className="tracker-search-dropdown">
              {results.map(train => (
                <button
                  key={train.trainNumber}
                  className="tracker-search-result"
                  onClick={() => handleSelect(train)}
                >
                  <div className="tracker-result-left">
                    <span className="tracker-result-number">{train.trainNumber}</span>
                    <span className="tracker-result-name">{train.trainName}</span>
                    <span className="tracker-result-route">{train.from} → {train.to}</span>
                  </div>
                  <span className={`tracker-result-badge tracker-badge--${
                    train.status === 'on_time' ? 'green'
                    : train.status === 'delayed' ? 'amber' : 'red'
                  }`}>
                    {train.status === 'on_time' ? 'On Time'
                      : train.status === 'delayed' ? `+${train.delayMinutes}m`
                      : 'Cancelled'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showResults && results.length === 0 && query.length >= 2 && !loading && (
            <div className="tracker-search-dropdown">
              <p className="tracker-no-results">No trains found for "{query}"</p>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="tracker-loading">
            <div className="tracker-loading-spinner" />
            <span>Fetching live data...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="tracker-error">⚠️ {error}</div>
        )}

        {/* No train selected — show all trains list */}
        {!selectedTrain && !loading && (
          <div className="tracker-all-trains">
            <p className="tracker-all-trains-label">Active Trains</p>
            {allTrains.map(train => (
              <button
                key={train.trainNumber}
                className="tracker-train-row"
                onClick={() => handleSelect(train)}
              >
                <div className="tracker-train-row-left">
                  <span className="tracker-train-row-num">{train.trainNumber}</span>
                  <span className="tracker-train-row-name">{train.trainName}</span>
                  <span className="tracker-train-row-route">{train.from} → {train.to}</span>
                </div>
                <span className={`tracker-result-badge tracker-badge--${
                  train.status === 'on_time' ? 'green'
                  : train.status === 'delayed' ? 'amber' : 'red'
                }`}>
                  {train.status === 'on_time' ? 'On Time'
                    : train.status === 'delayed' ? `+${train.delayMinutes}m`
                    : 'Cancelled'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Train selected — show full detail */}
        {selectedTrain && !loading && (
          <div className="tracker-detail">

            {/* Train header */}
            <div className="tracker-train-header">
              <div className="tracker-train-header-left">
                <span className="tracker-train-num">{selectedTrain.trainNumber}</span>
                <span className="tracker-train-name">{selectedTrain.trainName}</span>
                <span className="tracker-train-route">
                  {selectedTrain.from} → {selectedTrain.to}
                </span>
              </div>
              <span
                className="tracker-train-status-badge"
                style={{ color: delayColor, borderColor: delayColor + '33',
                  background: delayColor + '11' }}
              >
                {statusLabel}
              </span>
            </div>

            {/* Key info grid */}
            <div className="tracker-info-grid">
              <div className="tracker-info-box">
                <span className="tracker-info-label">Current Station</span>
                <span className="tracker-info-value">
                  {selectedTrain.currentStation || trainStatus?.currentStation || '—'}
                </span>
              </div>
              <div className="tracker-info-box">
                <span className="tracker-info-label">Next Station</span>
                <span className="tracker-info-value">
                  {selectedTrain.nextStation || '—'}
                </span>
              </div>
              <div className="tracker-info-box">
                <span className="tracker-info-label">Platform</span>
                <span className="tracker-info-value">
                  {selectedTrain.platform
                    ? `Platform ${selectedTrain.platform}`
                    : trainStatus?.platform
                    ? `Platform ${trainStatus.platform}`
                    : '—'}
                </span>
              </div>
              <div className="tracker-info-box">
                <span className="tracker-info-label">Last Updated</span>
                <span className="tracker-info-value">
                  {selectedTrain.lastUpdated
                    ? new Date(selectedTrain.lastUpdated).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit', hour12: false
                      })
                    : 'Live'}
                </span>
              </div>
            </div>

            {/* Delay reason */}
            {(selectedTrain.delayReason || trainStatus?.delayReason) && (
              <div className="tracker-delay-reason">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0
                    1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>{selectedTrain.delayReason || trainStatus?.delayReason}</span>
              </div>
            )}

            {/* Weather */}
            {weather && (
              <div className="tracker-weather">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
                </svg>
                <span>{weather.temp}°C · {weather.condition}</span>
                <span className="tracker-weather-city">at {weather.city}</span>
              </div>
            )}

            {/* AI suggestion for delayed trains */}
            {delayMinutes > 0 && (
              <div className="tracker-ai-suggestion">
                <div className="tracker-ai-suggestion-header">
                  <span className="tracker-ai-badge">⚡ RailSage Suggestion</span>
                </div>
                <p className="tracker-ai-text">
                  {delayMinutes >= 60
                    ? `This train is running ${delayMinutes} minutes late. Consider checking alternative trains or adjusting your departure time by at least ${Math.round(delayMinutes * 0.8)} minutes.`
                    : `This train is running ${delayMinutes} minutes late. You have some extra time — no need to rush to the station immediately.`
                  }
                </p>
                <button
                  className="tracker-ai-cta"
                  onClick={() => navigate('/alerts')}
                >
                  View full AI analysis →
                </button>
              </div>
            )}

            {/* Journey progress bar */}
            {totalStations > 0 && (
              <div className="tracker-progress-section">
                <div className="tracker-progress-header">
                  <span className="tracker-info-label">Journey Progress</span>
                  <span className="tracker-progress-count">
                    {passedCount} / {totalStations} stations
                  </span>
                </div>
                <div className="tracker-progress-bar">
                  <div
                    className="tracker-progress-fill"
                    style={{ width: `${(passedCount / totalStations) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upcoming stations timeline */}
            {upcomingStations.length > 0 && (
              <div className="tracker-stations">
                <p className="tracker-info-label" style={{ marginBottom: 10 }}>
                  Upcoming Stations
                </p>
                <div className="tracker-stations-list">
                  {upcomingStations.map((station, i) => {
                    const isCurrent = station.status === 'current'
                    return (
                      <div key={station.code} className="tracker-station-row">
                        <div className="tracker-station-line-wrap">
                          <div className={`tracker-station-dot ${
                            isCurrent ? 'tracker-station-dot--current' : ''
                          }`} />
                          {i < upcomingStations.length - 1 && (
                            <div className="tracker-station-connector" />
                          )}
                        </div>
                        <div className="tracker-station-info">
                          <div className="tracker-station-top">
                            <span className={`tracker-station-name ${
                              isCurrent ? 'tracker-station-name--current' : ''
                            }`}>
                              {station.name || station.code}
                            </span>
                            {isCurrent && (
                              <span className="tracker-station-now">NOW</span>
                            )}
                          </div>
                          <div className="tracker-station-times">
                            {station.arrival && (
                              <span>Arr: {station.arrival}</span>
                            )}
                            {station.departure && (
                              <span>Dep: {station.departure}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}