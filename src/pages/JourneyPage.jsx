export default function JourneyPage() {
  return (
    <div className="journey-page">
      <div className="journey-card">
        <h2 className="journey-title">Plan Your Journey</h2>
        <p className="journey-subtitle">AI-powered route planning across Indian Railways</p>

        <div className="journey-form">
          <div className="journey-field">
            <label>From</label>
            <input type="text" placeholder="Origin station or city" />
          </div>
          <div className="journey-swap">⇅</div>
          <div className="journey-field">
            <label>To</label>
            <input type="text" placeholder="Destination station or city" />
          </div>
          <div className="journey-field">
            <label>Date</label>
            <input type="date" />
          </div>
          <button className="journey-btn">Find Trains</button>
        </div>
      </div>

      <div className="journey-placeholder">
        <span>🚆</span>
        <p>Enter your journey details above to get AI-powered route suggestions, delay predictions, and alternatives.</p>
      </div>
    </div>
  )
}