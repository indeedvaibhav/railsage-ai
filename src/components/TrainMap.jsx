import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrain } from '../contexts/TrainContext';
import { getStatusInfo, formatDelay } from '../services/trainService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const STATION_COORDS = {
  NDLS: [28.6419, 77.2195], BCT: [18.9398, 72.8355], CSMT: [18.9398, 72.8355],
  PUNE: [18.5285, 73.8743],
  HWH: [22.5839, 88.3428], MAS: [13.0827, 80.2707], SBC: [12.9784, 77.5716],
  ADI: [23.0225, 72.5714], PUNE: [18.5285, 73.8743], JP: [26.9196, 75.7878],
  LKO: [26.8467, 80.9462], CNB: [26.4499, 80.3319], BPL: [23.2599, 77.4126],
  GWL: [26.2183, 78.1828], AGC: [27.1767, 78.0081], PNBE: [25.6093, 85.1376],
  GHY: [26.1445, 91.7362], TVC: [8.5241, 76.9366], ERS: [9.9816, 76.2999],
  CBE: [11.0168, 76.9558], SC: [17.4337, 78.5016], BBS: [20.2756, 85.8189],
  VSKP: [17.7215, 83.3013], NZM: [28.5821, 77.2341], DDN: [30.3165, 78.0322],
  UDZ: [24.5854, 73.7125], KOTA: [25.1867, 75.8472], BRC: [21.2051, 72.8397],
  BSB: [25.3176, 83.0066], MGS: [25.3766, 83.0064], RNC: [23.3432, 85.3096],
  CDG: [30.6730, 76.8092], DLI: [28.6614, 77.2312], ST: [21.2051, 72.8397],
  MTJ: [27.4924, 77.6737], BZM: [23.2000, 77.4000], ET: [25.4358, 81.8463],
  ALD: [25.4358, 81.8463], JHS: [25.4358, 78.5685], GZB: [28.6692, 77.4538],
  TDL: [24.6200, 77.4100], BRC: [21.2051, 72.8397], RTM: [24.9131, 74.6318],
  SVDK: [32.9580, 74.9478], JAT: [30.2940, 78.0696], PTA: [25.7900, 84.9100],
  AY: [25.4381, 81.8840], DHN: [23.7957, 86.4304], KGP: [22.3465, 87.3232],
  BHC: [21.1702, 79.0987], NGP: [21.1458, 79.0882], NED: [18.0405, 79.2650],
  WL: [17.9689, 79.5941], BZA: [16.5150, 80.6236], GNT: [16.2988, 80.4575],
  OGL: [16.9891, 81.7840], RJY: [17.0005, 81.7799],
};

function createTrainDot(status) {
  const colors = { on_time: '#34d399', delayed: '#fbbf24', cancelled: '#f87171' };
  const color = colors[status] || colors.on_time;
  return L.divIcon({
    className: 'sidebar-train-marker',
    html: `<div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px ${color}aa;z-index:2;"></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function createStationIcon(status) {
  const colors = { passed: '#64748b', current: '#06b6d4', upcoming: '#22d3ee', destination: '#f59e0b' };
  const color = colors[status] || colors.upcoming;
  const size = status === 'current' ? 14 : status === 'destination' ? 12 : 8;
  return L.divIcon({
    className: 'custom-station-icon',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid ${status === 'current' ? '#fff' : color};border-radius:50%;box-shadow:0 0 ${status === 'current' ? '12px' : '6px'} ${color}80;${status === 'current' ? 'animation:pulse-glow 2s infinite;' : ''}"></div>`,
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
  });
}

function createTrainIcon() {
  return L.divIcon({
    className: 'custom-train-icon',
    html: `<div class="train-marker"><div class="train-marker-dot"></div><div class="train-marker-ring"></div></div>`,
    iconSize: [28, 28], iconAnchor: [14, 14],
  });
}

function SetView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [map, center, zoom]);
  return null;
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions?.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 10 });
    }
  }, [map, positions]);
  return null;
}

export default function TrainMap() {
  const { language, t } = useLanguage();
  const { selectedTrain, trainStatus, trainSchedule, weather, allTrains, selectTrain } = useTrain();

  // Build route from schedule with coordinates
  const route = useMemo(() => {
    if (!trainSchedule?.stations?.length) return [];
    const currentCode = trainStatus?.currentStationCode;
    let foundCurrent = false;

    return trainSchedule.stations
      .map((s, i) => {
        const coords = STATION_COORDS[s.code];
        if (!coords) return null;

        let status = 'upcoming';
        if (s.code === currentCode) { status = 'current'; foundCurrent = true; }
        else if (trainStatus?.stations?.length) {
          const statusStation = trainStatus.stations.find(st => st.code === s.code);
          if (statusStation?.hasPassed) status = 'passed';
        } else if (!foundCurrent && i < trainSchedule.stations.length / 2) {
          // Heuristic: if no live status, assume first half passed
          status = 'passed';
        }

        return { code: s.code, name: s.name, lat: coords[0], lng: coords[1], status, arrival: s.arrival, departure: s.departure };
      })
      .filter(Boolean);
  }, [trainSchedule, trainStatus]);

  const currentStation = route.find(s => s.status === 'current');
  const positions = route.map(s => [s.lat, s.lng]);

  // Place trains on map using their source station coords
  const trainMarkers = allTrains
    .map(train => {
      const coords = STATION_COORDS[train.from] || STATION_COORDS[train.currentStationCode];
      if (!coords) return null;
      return { ...train, position: coords };
    })
    .filter(Boolean);

  if (!selectedTrain || route.length === 0) {
    const indiaCenter = [22.5, 79.0];
    return (
      <div className="train-map-container" style={{ position: 'relative' }}>
        <div className="signal-fault-badge" aria-label="Signal fault detected">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          SIGNAL FAULT
        </div>
        <div className="train-map-header">
          <h3 className="train-map-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {language === 'hi' ? 'भारत भर में चल रही ट्रेनें' : language === 'ja' ? 'インド全土の運行列車' : 'Trains running across India'}
          </h3>
          <span className="train-map-count">{trainMarkers.length} Active Trains</span>
        </div>
        <MapContainer center={indiaCenter} zoom={5} className="train-map" zoomControl={true} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
          <SetView center={indiaCenter} zoom={5} />
          {trainMarkers.map((train) => {
            const statusInfo = getStatusInfo(train.status || 'on_time', language);
            const delayText = train.delayMinutes > 0 ? formatDelay(train.delayMinutes, language) : null;
            return (
              <Marker key={train.trainNumber} position={train.position}
                icon={createTrainDot(train.status || 'on_time')}
                eventHandlers={{ click: () => selectTrain(train) }}>
                <Popup className="sidebar-train-popup" maxWidth={260} minWidth={220}>
                  <div className="sidebar-popup-card">
                    <div className="sidebar-popup-header">
                      <div className="sidebar-popup-train-id">
                        <span className="sidebar-popup-number">{train.trainNumber}</span>
                        <span className={`sidebar-popup-badge ${statusInfo.bgClass} ${statusInfo.textClass}`}>{statusInfo.label}</span>
                      </div>
                      <h4 className="sidebar-popup-name">{train.trainName}</h4>
                    </div>
                    <div className="sidebar-popup-route">
                      <div className="sidebar-popup-station">
                        <span className="sidebar-popup-code">{train.from}</span>
                        <span className="sidebar-popup-time">{train.departure || ''}</span>
                      </div>
                      <div className="sidebar-popup-arrow"><div className="sidebar-popup-line" />
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                      </div>
                      <div className="sidebar-popup-station">
                        <span className="sidebar-popup-code">{train.to}</span>
                        <span className="sidebar-popup-time">{train.arrival || ''}</span>
                      </div>
                    </div>
                    <div className="sidebar-popup-details">
                      {delayText && <div className="sidebar-popup-row sidebar-popup-delay">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg><span>{delayText}</span>
                      </div>}
                      {train.delayReason && <div className="sidebar-popup-reason">{train.delayReason}</div>}
                    </div>
                    <button className="sidebar-popup-action" onClick={(e) => { e.stopPropagation(); selectTrain(train); }}>
                      {t('viewOnMap')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        <div className="train-map-footer">
          <span className="map-legend-item"><span className="legend-dot" style={{ background: '#34d399' }} />{t('onTime')}</span>
          <span className="map-legend-item"><span className="legend-dot" style={{ background: '#fbbf24' }} />{t('delayed')}</span>
          <span className="map-legend-item"><span className="legend-dot" style={{ background: '#f87171' }} />{t('cancelled')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="train-map-container">
      <div className="train-map-header">
        <h3 className="train-map-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {selectedTrain.trainNumber} {selectedTrain.trainName}
        </h3>
        {weather && <span className="train-map-weather">{weather.temp}°C {weather.condition}</span>}
      </div>

      <MapContainer center={[22.5, 79.0]} zoom={5} className="train-map" zoomControl={true} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
        <FitBounds positions={positions} />

        {positions.length > 1 && (
          <Polyline positions={positions} pathOptions={{ color: '#06b6d4', weight: 3, opacity: 0.8 }} />
        )}

        {route.map((s, i) => {
          const isLast = i === route.length - 1;
          return (
            <Marker key={s.code} position={[s.lat, s.lng]} icon={createStationIcon(isLast ? 'destination' : s.status)}>
              <Popup>
                <div className="popup-content">
                  <strong>{s.name} ({s.code})</strong>
                  {s.arrival && <div className="popup-time">Arr: {s.arrival}</div>}
                  {s.departure && <div className="popup-time">Dep: {s.departure}</div>}
                  <div className={`popup-status popup-status-${s.status}`}>
                    {s.status === 'passed' ? '✓ Passed' : s.status === 'current' ? '● Current' : '○ Upcoming'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {currentStation && (
          <Marker position={[currentStation.lat, currentStation.lng]} icon={createTrainIcon()}>
            <Popup>
              <div className="popup-content">
                <strong>{selectedTrain.trainName}</strong>
                <div className="popup-time">
                  {selectedTrain.delayMinutes > 0 ? `Late by ${selectedTrain.delayMinutes} min` : 'On Time'}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="train-map-footer">
        <span className="map-legend-item"><span className="legend-dot legend-passed" />{t('stationPassed')}</span>
        <span className="map-legend-item"><span className="legend-dot legend-current" />{t('stationCurrent')}</span>
        <span className="map-legend-item"><span className="legend-dot legend-upcoming" />{t('stationUpcoming')}</span>
        <span className="map-legend-item"><span className="legend-dot legend-destination" />{route[route.length - 1]?.name || ''}</span>
      </div>
    </div>
  );
}

/* Add train map placeholder */

/* Integrate train context with map */

/* Implement Leaflet map with Carto tiles */

/* Add train markers to map */
