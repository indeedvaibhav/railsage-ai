import { trains } from './trainData';
import { getActiveDisruptions } from './disruptions';

const now = Date.now();

export const BOOTSTRAP_TRAINS = [
  trains.find((t) => t.trainNumber === '12951'),
  trains.find((t) => t.trainNumber === '12301'),
  trains.find((t) => t.trainNumber === '12621'),
  trains.find((t) => t.trainNumber === '12028'),
  trains.find((t) => t.trainNumber === '22691'),
].filter(Boolean).map((train) => ({
  trainNumber: train.trainNumber,
  trainName: train.trainName,
  from: train.from,
  to: train.to,
  status: train.status,
  delayMinutes: train.delayMinutes,
  delayReason: train.delayReason,
  currentStation: train.currentStation,
  currentStationCode: train.route.find((s) => s.status === 'current')?.code,
  platform: train.platform,
  lastUpdated: train.lastUpdated,
  departure: train.scheduledDeparture,
  arrival: train.scheduledArrival,
}));

export const BOOTSTRAP_METRICS = {
  activeTrains: 847,
  onTimePercent: 72,
  delayedPercent: 23,
  incidents: getActiveDisruptions().length,
};

export const BOOTSTRAP_REASONING_EVENTS = [
  {
    id: 'evt-1',
    type: 'scan',
    message: 'Scanning 847 active trains across Northern, Western & Eastern Railway zones',
    timestamp: new Date(now - 180000).toISOString(),
  },
  {
    id: 'evt-2',
    type: 'alert',
    message: 'Detected 23 min delay on 12951 Mumbai Rajdhani near Vadodara — correlating with rake positioning',
    timestamp: new Date(now - 95000).toISOString(),
  },
  {
    id: 'evt-3',
    type: 'weather',
    message: 'Fog advisory active on Delhi–Kanpur corridor — speed restrictions affecting 3 Rajdhani services',
    timestamp: new Date(now - 42000).toISOString(),
  },
];

export const BOOTSTRAP_INCIDENT = getActiveDisruptions()[0] ?? null;

/* Update bootstrap data */
