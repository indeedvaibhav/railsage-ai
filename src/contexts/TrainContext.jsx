import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { searchTrains, fetchTrainStatus, fetchTrainSchedule, fetchWeather } from '../services/trainService';
import { BOOTSTRAP_TRAINS } from '../data/bootstrapData';

const TrainContext = createContext();
export const useTrain = () => useContext(TrainContext);

const MAJOR_TRAINS = [
  { trainNumber: '12951', trainName: 'Mumbai Rajdhani', from: 'BCT', to: 'NDLS' },
  { trainNumber: '12004', trainName: 'Lucknow Shatabdi', from: 'NDLS', to: 'LKO' },
  { trainNumber: '12801', trainName: 'Purushottam Exp', from: 'BBS', to: 'NDLS' },
  { trainNumber: '12621', trainName: 'Tamil Nadu Exp', from: 'MAS', to: 'NDLS' },
  { trainNumber: '12269', trainName: 'Duronto Express', from: 'MAS', to: 'NZM' },
  { trainNumber: '12903', trainName: 'Golden Temple Mail', from: 'BCT', to: 'ASR' },
  { trainNumber: '12301', trainName: 'Howrah Rajdhani', from: 'HWH', to: 'NDLS' },
  { trainNumber: '22691', trainName: 'Rajdhani Express', from: 'SBC', to: 'NZM' },
  { trainNumber: '12423', trainName: 'Dibrugarh Rajdhani', from: 'DBRG', to: 'NDLS' },
  { trainNumber: '12925', trainName: 'Paschim Express', from: 'BDTS', to: 'ASR' },
];

export function TrainProvider({ children }) {
  const [allTrains, setAllTrains] = useState(BOOTSTRAP_TRAINS);
  const [recentTrains, setRecentTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [trainStatus, setTrainStatus] = useState(null);   // live status of selected
  const [trainSchedule, setTrainSchedule] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  // Search trains by query (number or name)
  const search = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    setLoading(true);
    setError(null);
    const results = await searchTrains(query);
    setLoading(false);
    if (!results) {
      setError('Could not fetch train data. Check your API key.');
      return [];
    }
    return results;
  }, []);

  // Select a train and fetch its live status + schedule
  const selectTrain = useCallback(async (train) => {
    if (!train?.trainNumber) return;
    setSelectedTrain(train);
    setTrainStatus(null);
    setTrainSchedule(null);
    setWeather(null);
    setLoading(true);

    // Add to recent trains (no duplicates)
    setRecentTrains(prev => {
      const filtered = prev.filter(t => t.trainNumber !== train.trainNumber);
      return [train, ...filtered].slice(0, 20);
    });

    // Fetch status + schedule in parallel
    const [status, schedule] = await Promise.all([
      fetchTrainStatus(train.trainNumber),
      fetchTrainSchedule(train.trainNumber),
    ]);

    setTrainStatus(status);
    setTrainSchedule(schedule);
    setLoading(false);

    if (status) {
      // Merge status data into the train object for display
      const enriched = {
        ...train,
        status: status.delayMinutes > 0 ? 'delayed' : 'on_time',
        delayMinutes: status.delayMinutes,
        delayReason: status.delayReason,
        currentStation: status.currentStation,
        platform: status.platform,
        lastUpdated: status.lastUpdated,
      };
      setSelectedTrain(enriched);

      // Update in recent trains too
      setRecentTrains(prev => prev.map(t =>
        t.trainNumber === train.trainNumber ? enriched : t
      ));

      // Update allTrains if present
      setAllTrains(prev => {
        const exists = prev.some(t => t.trainNumber === train.trainNumber);
        if (exists) return prev.map(t => t.trainNumber === train.trainNumber ? enriched : t);
        return [enriched, ...prev];
      });
    }

    // Fetch weather for source station if we have coordinates from schedule
    if (schedule?.stations?.length > 0) {
      // Try to get coords from station data — we'll use a known coords map
      const sourceCode = schedule.stations[0]?.code;
      if (sourceCode) {
        const coords = STATION_COORDS[sourceCode];
        if (coords) {
          const w = await fetchWeather(coords.lat, coords.lng);
          setWeather(w);
        }
      }
    }
  }, []);

  // Poll selected train status every 60s
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!selectedTrain?.trainNumber) return;

    pollRef.current = setInterval(async () => {
      console.log('[TrainContext] Polling status for', selectedTrain.trainNumber);
      const status = await fetchTrainStatus(selectedTrain.trainNumber);
      if (status) {
        setTrainStatus(status);
        setSelectedTrain(prev => prev ? {
          ...prev,
          status: status.delayMinutes > 0 ? 'delayed' : 'on_time',
          delayMinutes: status.delayMinutes,
          currentStation: status.currentStation,
          platform: status.platform,
        } : prev);
      }
    }, 60000);

    return () => clearInterval(pollRef.current);
  }, [selectedTrain?.trainNumber]);

  // Fetch live status for all major trains on mount
  useEffect(() => {
    const fetchAllTrainsStatus = async () => {
      const updatedTrains = await Promise.all(
        MAJOR_TRAINS.map(async (train) => {
          const status = await fetchTrainStatus(train.trainNumber);
          if (status) {
            return {
              ...train,
              status: status.delayMinutes > 0 ? 'delayed' : 'on_time',
              delayMinutes: status.delayMinutes,
              delayReason: status.delayReason,
              currentStation: status.currentStation,
              platform: status.platform,
              lastUpdated: status.lastUpdated,
            };
          }
          return train;
        })
      );
      setAllTrains(updatedTrains);
    };
    fetchAllTrainsStatus();
    
    const allPoll = setInterval(fetchAllTrainsStatus, 5 * 60000); // refresh every 5 min
    return () => clearInterval(allPoll);
  }, []);

  // Build context string for Claude
  const buildTrainContext = useCallback(() => {
    const parts = [];
    if (selectedTrain) {
      parts.push(`Selected: ${selectedTrain.trainNumber} ${selectedTrain.trainName} (${selectedTrain.from}→${selectedTrain.to})`);
    }
    if (trainStatus) {
      parts.push(`Status: ${trainStatus.delayMinutes > 0 ? `Delayed ${trainStatus.delayMinutes}min` : 'On Time'}`);
      if (trainStatus.currentStation) parts.push(`At: ${trainStatus.currentStation}`);
      if (trainStatus.platform) parts.push(`Platform: ${trainStatus.platform}`);
      if (trainStatus.delayReason) parts.push(`Reason: ${trainStatus.delayReason}`);
    }
    if (trainSchedule?.stations?.length) {
      parts.push(`Route: ${trainSchedule.stations.map(s => s.name || s.code).join(' → ')}`);
    }
    if (weather) {
      parts.push(`Weather: ${weather.temp}°C ${weather.condition} at ${weather.city}`);
    }
    if (recentTrains.length > 0) {
      parts.push(`Recent lookups: ${recentTrains.map(t => `${t.trainNumber} ${t.trainName}`).join(', ')}`);
    }
    return parts.join('\n') || 'No train data loaded yet. User has not searched for any train.';
  }, [selectedTrain, trainStatus, trainSchedule, weather, recentTrains]);

  return (
    <TrainContext.Provider value={{
      allTrains,
      recentTrains,
      selectedTrain,
      trainStatus,
      trainSchedule,
      weather,
      loading,
      error,
      search,
      selectTrain,
      buildTrainContext,
    }}>
      {children}
    </TrainContext.Provider>
  );
}

// Known Indian station coordinates for weather lookups
const STATION_COORDS = {
  NDLS: { lat: 28.6419, lng: 77.2195 },
  BCT: { lat: 18.9398, lng: 72.8355 },
  CSMT: { lat: 18.9398, lng: 72.8355 },
  HWH: { lat: 22.5839, lng: 88.3428 },
  MAS: { lat: 13.0827, lng: 80.2707 },
  SBC: { lat: 12.9784, lng: 77.5716 },
  ADI: { lat: 23.0225, lng: 72.5714 },
  PUNE: { lat: 18.5285, lng: 73.8743 },
  JP: { lat: 26.9196, lng: 75.7878 },
  LKO: { lat: 26.8467, lng: 80.9462 },
  CNB: { lat: 26.4499, lng: 80.3319 },
  BPL: { lat: 23.2599, lng: 77.4126 },
  GWL: { lat: 26.2183, lng: 78.1828 },
  AGC: { lat: 27.1767, lng: 78.0081 },
  PNBE: { lat: 25.6093, lng: 85.1376 },
  GHY: { lat: 26.1445, lng: 91.7362 },
  TVC: { lat: 8.5241, lng: 76.9366 },
  ERS: { lat: 9.9816, lng: 76.2999 },
  CBE: { lat: 11.0168, lng: 76.9558 },
  SC: { lat: 17.4337, lng: 78.5016 },
  BBS: { lat: 20.2756, lng: 85.8189 },
  VSKP: { lat: 17.7215, lng: 83.3013 },
  RNC: { lat: 23.3432, lng: 85.3096 },
  CDG: { lat: 30.6730, lng: 76.8092 },
  DDN: { lat: 30.3165, lng: 78.0322 },
  JAT: { lat: 30.2940, lng: 78.0696 },
  UDZ: { lat: 24.5854, lng: 73.7125 },
  KOTA: { lat: 25.1867, lng: 75.8472 },
  RTM: { lat: 24.9131, lng: 74.6318 },
  BRC: { lat: 21.2051, lng: 72.8397 },
  ST: { lat: 21.2051, lng: 72.8397 },
  NZM: { lat: 28.5821, lng: 77.2341 },
  DLI: { lat: 28.6614, lng: 77.2312 },
  MGS: { lat: 25.3766, lng: 83.0064 },
  BSB: { lat: 25.3176, lng: 83.0066 },
  CNB: { lat: 26.4499, lng: 80.3319 },
};

/* Setup base context structure */

/* Integrate train context with map */
