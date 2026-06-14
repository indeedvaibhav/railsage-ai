import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrain } from '../contexts/TrainContext';
import { getStatusInfo, formatDelay } from '../services/trainService';

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

function SetView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [map, center, zoom]);
  return null;
}

// Station coordinates for placing markers on map
const STATION_COORDS = {
  NDLS: [28.6419, 77.2195], BCT: [18.9398, 72.8355], CSMT: [18.9398, 72.8355],
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
};

export default function SidebarMap({ onClose }) {
  const { language, t } = useLanguage();
  const { allTrains, selectTrain } = useTrain();
  const indiaCenter = [22.5, 79.0];

  // Place trains on map using their source station coords
  const trainMarkers = allTrains
    .map(train => {
      const coords = STATION_COORDS[train.from] || STATION_COORDS[train.currentStationCode];
      if (!coords) return null;
      return { ...train, position: coords };
    })
    .filter(Boolean);

  return (
    <div className="sidebar-map-wrapper">
      <div className="sidebar-map-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
        </svg>
        <span>
          {language === 'hi' ? 'भारत भर में चल रही ट्रेनें' :
           language === 'ja' ? 'インド全土の運行列車' :
           'Trains running across India'}
        </span>
        <span className="sidebar-map-count">{trainMarkers.length}</span>
      </div>

      <div className="sidebar-map-container">
        <MapContainer center={indiaCenter} zoom={5} className="sidebar-leaflet-map"
          zoomControl={false} attributionControl={false} scrollWheelZoom={true} dragging={true}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
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
                      {train.currentStation && <div className="sidebar-popup-row">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg><span>{t('currentlyAt')}: <strong>{train.currentStation}</strong></span>
                      </div>}
                    </div>
                    <button className="sidebar-popup-action" onClick={(e) => { e.stopPropagation(); selectTrain(train); onClose(); }}>
                      {t('viewOnMap')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="sidebar-map-legend">
        <span className="sidebar-legend-item"><span className="sidebar-legend-dot" style={{ background: '#34d399' }} />{t('onTime')}</span>
        <span className="sidebar-legend-item"><span className="sidebar-legend-dot" style={{ background: '#fbbf24' }} />{t('delayed')}</span>
        <span className="sidebar-legend-item"><span className="sidebar-legend-dot" style={{ background: '#f87171' }} />{t('cancelled')}</span>
      </div>
    </div>
  );
}
