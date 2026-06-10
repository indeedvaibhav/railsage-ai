// Train service — REAL API calls only. No mock data.
// If API returns null, we pass null through. Never fake it.

export async function searchTrains(query) {
  try {
    const res = await fetch(`/api/train/search?query=${encodeURIComponent(query)}`);
    const { data, error } = await res.json();
    if (error || !data) { console.warn('[trainService] search failed:', error); return null; }
    // data is already the array from our server
    const trains = Array.isArray(data) ? data : (data.data || data.body || []);
    if (!Array.isArray(trains)) return null;
    return trains.map(normalizeTrain).filter(Boolean);
  } catch (e) { console.warn('[trainService] search error:', e.message); return null; }
}

export async function fetchTrainStatus(trainNo) {
  try {
    const res = await fetch(`/api/train/status/${trainNo}`);
    const { data, error } = await res.json();
    if (error || !data) { console.warn('[trainService] status failed:', error); return null; }
    return normalizeStatus(data);
  } catch (e) { console.warn('[trainService] status error:', e.message); return null; }
}

export async function fetchTrainSchedule(trainNo) {
  try {
    const res = await fetch(`/api/train/schedule/${trainNo}`);
    const { data, error } = await res.json();
    if (error || !data) { console.warn('[trainService] schedule failed:', error); return null; }
    return normalizeSchedule(data);
  } catch (e) { console.warn('[trainService] schedule error:', e.message); return null; }
}

export async function fetchTrainsBetween(from, to) {
  try {
    const res = await fetch(`/api/train/between?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    const { data, error } = await res.json();
    if (error || !data) { console.warn('[trainService] between failed:', error); return null; }
    const trains = data.data || data.body || data;
    if (!Array.isArray(trains)) return null;
    return trains.map(normalizeTrain).filter(Boolean);
  } catch (e) { console.warn('[trainService] between error:', e.message); return null; }
}

export async function fetchWeather(lat, lng) {
  try {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
    const { data, error } = await res.json();
    if (error || !data) { console.warn('[trainService] weather failed:', error); return null; }
    return data;
  } catch (e) { console.warn('[trainService] weather error:', e.message); return null; }
}

// --- Normalizers: adapt RapidAPI shapes to our UI format ---

function normalizeTrain(raw) {
  if (!raw) return null;
  const trainNumber = raw.train_number || raw.trainNumber || raw.train_no || raw.train_num || '';
  if (!trainNumber) return null; // skip if no train number at all
  return {
    trainNumber,
    trainName: raw.train_name || raw.trainName || raw.name || '',
    from: raw.source || raw.from_stn_code || raw.from || '',
    to: raw.destination || raw.to_stn_code || raw.to || '',
    fromName: raw.source_stn_name || raw.from_stn_name || raw.source || '',
    toName: raw.destn_stn_name || raw.to_stn_name || raw.destination || '',
    departure: raw.from_time || raw.departure || '',
    arrival: raw.to_time || raw.arrival || '',
    duration: raw.travel_time || raw.duration || '',
    runDays: raw.run_days || '',
    trainType: raw.train_type || raw.type || '',
  };
}

function normalizeStatus(raw) {
  if (!raw) return null;
  const body = raw.data || raw.body || raw;
  // API may return nested structures
  const current = body.current_station_info || body.current_station || {};
  const stations = body.route || body.stations || [];
  
  return {
    trainNumber: body.train_number || body.trainNumber || '',
    trainName: body.train_name || body.trainName || '',
    currentStation: current.station_name || current.stationName || body.current_station_name || null,
    currentStationCode: current.station_code || current.stationCode || null,
    status: body.status || (body.delay && parseInt(body.delay) > 0 ? 'delayed' : 'on_time'),
    delayMinutes: parseInt(body.delay || body.late_min || '0') || 0,
    delayReason: body.delay_reason || null,
    lastUpdated: body.updated_time || body.lastUpdated || new Date().toISOString(),
    platform: body.platform || body.platform_number || null,
    stations: Array.isArray(stations) ? stations.map(s => ({
      code: s.station_code || s.stationCode || '',
      name: s.station_name || s.stationName || '',
      scheduledArrival: s.scheduled_arrival || s.sta || '',
      actualArrival: s.actual_arrival || s.eta || '',
      scheduledDeparture: s.scheduled_departure || s.std || '',
      actualDeparture: s.actual_departure || s.etd || '',
      delayArrival: parseInt(s.delay_in_arrival || '0') || 0,
      delayDeparture: parseInt(s.delay_in_departure || '0') || 0,
      hasPassed: s.has_arrived === true || s.has_departed === true || s.status === 'passed',
    })) : [],
  };
}

function normalizeSchedule(raw) {
  if (!raw) return null;
  const body = raw.data || raw.body || raw;
  const stations = body.route || body.stations || body.schedule || [];
  return {
    trainNumber: body.train_number || body.trainNumber || '',
    trainName: body.train_name || body.trainName || '',
    stations: Array.isArray(stations) ? stations.map(s => ({
      code: s.station_code || s.stationCode || '',
      name: s.station_name || s.stationName || '',
      arrival: s.arrival_time || s.sta || '',
      departure: s.departure_time || s.std || '',
      haltMinutes: parseInt(s.halt || '0') || 0,
      distance: parseInt(s.distance || '0') || 0,
      day: parseInt(s.day || '1') || 1,
    })) : [],
  };
}

// --- Display formatters ---

export function formatDelay(minutes, lang = 'en') {
  if (!minutes || minutes === 0) return null;
  if (lang === 'hi') {
    if (minutes < 60) return `${minutes} मिनट देरी`;
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return m > 0 ? `${h} घंटा ${m} मिनट देरी` : `${h} घंटा देरी`;
  }
  if (lang === 'ja') {
    if (minutes < 60) return `${minutes}分遅延`;
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return m > 0 ? `${h}時間${m}分遅延` : `${h}時間遅延`;
  }
  if (minutes < 60) return `${minutes} min late`;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m > 0 ? `${h}h ${m}m late` : `${h}h late`;
}

export function getStatusInfo(status, lang = 'en') {
  const map = {
    on_time: { label: { en: 'On Time', hi: 'समय पर', ja: '定刻' }, bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400', dotClass: 'bg-emerald-400' },
    delayed: { label: { en: 'Delayed', hi: 'देरी से', ja: '遅延' }, bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', dotClass: 'bg-amber-400' },
    cancelled: { label: { en: 'Cancelled', hi: 'रद्द', ja: '運休' }, bgClass: 'bg-red-500/20', textClass: 'text-red-400', dotClass: 'bg-red-400' },
  };
  const info = map[status] || map.on_time;
  return { ...info, label: info.label[lang] || info.label.en };
}

/* Add train service for real API calls */

/* Integrate rapid api shape normalizers */
