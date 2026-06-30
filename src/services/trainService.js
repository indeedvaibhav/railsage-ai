// Train service — calls our Express backend which proxies rappid.in

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function searchTrains(query) {
  try {
    const res  = await fetch(`${API_BASE}/api/train/search?query=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (!json.data) return [];
    const list = Array.isArray(json.data) ? json.data : [];
    return list.map(normalizeTrain).filter(Boolean);
  } catch (e) {
    console.warn('[trainService] search error:', e.message);
    return [];
  }
}

export async function fetchTrainStatus(trainNo) {
  try {
    const res  = await fetch(`${API_BASE}/api/train/status/${trainNo}`);
    const json = await res.json();
    if (!json.data) return null;
    return normalizeStatus(json.data);
  } catch (e) {
    console.warn('[trainService] status error:', e.message);
    return null;
  }
}

export async function fetchTrainSchedule(trainNo) {
  try {
    const res  = await fetch(`${API_BASE}/api/train/schedule/${trainNo}`);
    const json = await res.json();
    if (!json.data) return null;
    return normalizeSchedule(json.data);
  } catch (e) {
    console.warn('[trainService] schedule error:', e.message);
    return null;
  }
}

export async function fetchTrainsBetween(from, to) {
  try {
    const res  = await fetch(`${API_BASE}/api/train/between?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    const json = await res.json();
    if (!json.data) return [];
    return (Array.isArray(json.data) ? json.data : []).map(normalizeTrain).filter(Boolean);
  } catch (e) {
    console.warn('[trainService] between error:', e.message);
    return [];
  }
}

export async function fetchWeather(lat, lng) {
  try {
    const res  = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lng}`);
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    console.warn('[trainService] weather error:', e.message);
    return null;
  }
}

// ── Normalizers ───────────────────────────────────────────
// These adapt the server response into the shape the UI expects

function normalizeTrain(raw) {
  if (!raw) return null;
  const trainNumber = raw.train_number || raw.trainNumber || '';
  if (!trainNumber) return null;
  return {
    trainNumber,
    trainName:  raw.train_name  || raw.trainName  || '',
    from:       raw.source      || raw.from        || '',
    to:         raw.destination || raw.to          || '',
    status:     raw.status      || 'on_time',
    delayMinutes: parseInt(raw.delay || raw.late_min || '0') || 0,
  };
}

function normalizeStatus(data) {
  if (!data) return null;

  // data is already the clean shape from our server
  const delayMin = parseInt(data.delay ?? data.late_min ?? 0) || 0;

  const stations = Array.isArray(data.route) ? data.route.map(s => ({
    code:                s.station_code    || '',
    name:                s.station_name    || '',
    scheduledArrival:    s.arrival_time    || '',
    scheduledDeparture:  s.departure_time  || '',
    actualArrival:       s.arrival_time    || '',
    actualDeparture:     s.departure_time  || '',
    delayArrival:        parseInt(s.delay_in_arrival || '0') || 0,
    hasPassed:           s.has_arrived     || s.status === 'passed',
    isCurrent:           s.is_current      || s.status === 'current',
    platform:            s.platform_number || '',
    status:              s.status          || 'upcoming',
  })) : [];

  return {
    trainNumber:        data.train_number         || '',
    trainName:          data.train_name           || '',
    currentStation:     data.current_station_name || data.current_station_info?.station_name || '',
    currentStationCode: data.current_station_info?.station_code || '',
    delayMinutes:       delayMin,
    delayReason:        data.delay_reason         || null,
    status:             delayMin > 0 ? 'delayed'  : 'on_time',
    platform:           data.platform             || '',
    lastUpdated:        data.updated_time         || new Date().toISOString(),
    statusMessage:      data.status_message       || '',
    stations,
  };
}

function normalizeSchedule(data) {
  if (!data) return null;
  const rawStations = data.route || data.stations || [];

  return {
    trainNumber: data.train_number || '',
    trainName:   data.train_name   || '',
    stations: rawStations.map(s => ({
      code:      s.station_code   || '',
      name:      s.station_name   || '',
      arrival:   s.arrival_time   || '',
      departure: s.departure_time || '',
      distance:  s.distance       || 0,
      halt:      s.halt           || '',
      platform:  s.platform       || '',
      day:       s.day            || 1,
      status:    s.status         || 'upcoming',
    })),
  };
}

// ── Display helpers ───────────────────────────────────────

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
    on_time:  { label: { en: 'On Time',   hi: 'समय पर', ja: '定刻' }, bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' },
    delayed:  { label: { en: 'Delayed',   hi: 'देरी से', ja: '遅延' }, bgClass: 'bg-amber-500/20',   textClass: 'text-amber-400'   },
    cancelled:{ label: { en: 'Cancelled', hi: 'रद्द',    ja: '運休' }, bgClass: 'bg-red-500/20',     textClass: 'text-red-400'     },
  };
  const info = map[status] || map.on_time;
  return { ...info, label: info.label[lang] || info.label.en };
}