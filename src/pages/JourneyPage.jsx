import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchStations, resolveStationCode } from "../data/stations";
import { fetchTrainsBetween } from "../services/trainService";

export default function JourneyPage() {
  const navigate = useNavigate();

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  function handleFromChange(e) {
    const val = e.target.value;
    setFromQuery(val);
    setFromCode("");
    if (val.length < 1) {
      setFromResults([]);
      setShowFromDropdown(false);
      return;
    }
    setFromResults(searchStations(val, 6));
    setShowFromDropdown(true);
  }

  function handleToChange(e) {
    const val = e.target.value;
    setToQuery(val);
    setToCode("");
    if (val.length < 1) {
      setToResults([]);
      setShowToDropdown(false);
      return;
    }
    setToResults(searchStations(val, 6));
    setShowToDropdown(true);
  }

  function selectFrom(station) {
    setFromQuery(station.name);
    setFromCode(station.code);
    setShowFromDropdown(false);
  }

  function selectTo(station) {
    setToQuery(station.name);
    setToCode(station.code);
    setShowToDropdown(false);
  }

  function handleSwap() {
    const fq = fromQuery,
      fc = fromCode;
    setFromQuery(toQuery);
    setFromCode(toCode);
    setToQuery(fq);
    setToCode(fc);
  }

  async function handleSearch() {
    const resolvedFrom = fromCode || resolveStationCode(fromQuery);
    const resolvedTo = toCode || resolveStationCode(toQuery);
    if (!resolvedFrom || !resolvedTo) return;

    setLoading(true);
    setSearched(true);
    setShowFromDropdown(false);
    setShowToDropdown(false);

    const results = await fetchTrainsBetween(resolvedFrom, resolvedTo);
    setTrains(results || []);
    setLoading(false);
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (fromRef.current && !fromRef.current.contains(e.target))
        setShowFromDropdown(false);
      if (toRef.current && !toRef.current.contains(e.target))
        setShowToDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const canSearch = fromQuery.trim().length > 0 && toQuery.trim().length > 0;

  return (
    <div className="journey-page">
      <div className="journey-card">
        <h2 className="journey-title">Plan Your Journey</h2>
        <p className="journey-subtitle">
          Find trains between any two stations in India
        </p>

        <div className="journey-form">
          {/* FROM */}
          <div
            className="journey-field"
            ref={fromRef}
            style={{ position: "relative" }}
          >
            <label>From</label>
            <input
              type="text"
              placeholder="Origin station or city"
              value={fromQuery}
              onChange={handleFromChange}
              onFocus={() =>
                fromResults.length > 0 && setShowFromDropdown(true)
              }
              autoComplete="off"
            />
            {showFromDropdown && fromResults.length > 0 && (
              <div className="journey-dropdown">
                {fromResults.map((s) => (
                  <button
                    key={s.code}
                    className="journey-dropdown-item"
                    onClick={() => selectFrom(s)}
                  >
                    <span className="journey-dropdown-name">{s.name}</span>
                    <span className="journey-dropdown-code">{s.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="journey-swap"
            onClick={handleSwap}
            title="Swap stations"
          >
            ⇅
          </div>

          {/* TO */}
          <div
            className="journey-field"
            ref={toRef}
            style={{ position: "relative" }}
          >
            <label>To</label>
            <input
              type="text"
              placeholder="Destination station or city"
              value={toQuery}
              onChange={handleToChange}
              onFocus={() => toResults.length > 0 && setShowToDropdown(true)}
              autoComplete="off"
            />
            {showToDropdown && toResults.length > 0 && (
              <div className="journey-dropdown">
                {toResults.map((s) => (
                  <button
                    key={s.code}
                    className="journey-dropdown-item"
                    onClick={() => selectTo(s)}
                  >
                    <span className="journey-dropdown-name">{s.name}</span>
                    <span className="journey-dropdown-code">{s.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="journey-field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            className="journey-btn"
            disabled={!canSearch}
            onClick={handleSearch}
          >
            Find Trains
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="tracker-loading"
          style={{ justifyContent: "center", padding: "24px" }}
        >
          <div className="tracker-loading-spinner" />
          <span>Searching trains...</span>
        </div>
      )}

      {/* Results */}
      {!loading && searched && trains.length === 0 && (
        <div className="journey-placeholder">
          <span>🔍</span>
          <p>
            No trains found in our database for this route yet. Our journey
            planner covers major routes — try searching a specific train number
            on the
            <button
              className="journey-track-btn"
              style={{
                display: "inline",
                margin: "0 4px",
                verticalAlign: "baseline",
              }}
              onClick={() => navigate("/tracker")}
            >
              Tracker page
            </button>
            instead.
          </p>
        </div>
      )}

      {!loading && trains.length > 0 && (
        <div className="journey-results">
          <p className="journey-results-count">
            {trains.length} train{trains.length > 1 ? "s" : ""} found
          </p>
          {trains.map((train) => (
            <div key={train.trainNumber} className="journey-result-card">
              <div className="journey-result-left">
                <span className="journey-result-number">
                  {train.trainNumber}
                </span>
                <span className="journey-result-name">{train.trainName}</span>
                <span className="journey-result-route">
                  {train.from} → {train.to}
                </span>
              </div>
              <button
                className="journey-track-btn"
                onClick={() => navigate("/tracker")}
              >
                Track this train →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state before any search */}
      {!searched && (
        <div className="journey-placeholder">
          <span>🚆</span>
          <p>
            Enter your journey details above to find trains between stations.
          </p>
        </div>
      )}
    </div>
  );
}
