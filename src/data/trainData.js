// Mock Indian Railways train data with realistic names, numbers, routes, and statuses
// All data is for demo purposes — simulating a real-time feed

export const trains = [
  {
    trainNumber: '12027',
    trainName: 'Shatabdi Express',
    from: 'PUNE',
    to: 'CSMT',
    scheduledDeparture: '06:15',
    scheduledArrival: '15:30',
    actualDeparture: '06:45',
    expectedArrival: '16:15',
    status: 'delayed',
    delayMinutes: 45,
    delayReason: 'Signal issue near Lonavala causing slower speeds on the ghat section',
    currentStation: 'Karjat',
    nextStation: 'Panvel',
    platform: 3,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 18.8637, lng: 73.3230 },
    route: [
      { code: 'PUNE', name: 'Pune Junction', lat: 18.5289, lng: 73.8744, scheduled: '06:15', status: 'passed' },
      { code: 'SHV', name: 'Shivajinagar', lat: 18.5362, lng: 73.8509, scheduled: '06:22', status: 'passed' },
      { code: 'CCH', name: 'Chinchwad', lat: 18.6298, lng: 73.7997, scheduled: '06:35', status: 'passed' },
      { code: 'LNL', name: 'Lonavala', lat: 18.7481, lng: 73.4072, scheduled: '07:45', status: 'passed' },
      { code: 'KJT', name: 'Karjat', lat: 18.9100, lng: 73.3228, scheduled: '09:00', status: 'current' },
      { code: 'PNV', name: 'Panvel', lat: 18.9894, lng: 73.1175, scheduled: '10:15', status: 'upcoming' },
      { code: 'TNA', name: 'Thane', lat: 19.1860, lng: 72.9756, scheduled: '11:30', status: 'upcoming' },
      { code: 'DR', name: 'Dadar', lat: 19.0178, lng: 72.8478, scheduled: '14:45', status: 'upcoming' },
      { code: 'CSMT', name: 'Mumbai CST', lat: 18.9402, lng: 72.8355, scheduled: '15:30', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12028',
    trainName: 'Shatabdi Express',
    from: 'CSMT',
    to: 'PUNE',
    scheduledDeparture: '17:00',
    scheduledArrival: '20:25',
    actualDeparture: '17:00',
    expectedArrival: '20:25',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'Mumbai CST',
    nextStation: 'Dadar',
    platform: 5,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 18.9402, lng: 72.8355 },
    route: [
      { code: 'CSMT', name: 'Mumbai CST', lat: 18.9402, lng: 72.8355, scheduled: '17:00', status: 'current' },
      { code: 'DR', name: 'Dadar', lat: 19.0178, lng: 72.8478, scheduled: '17:15', status: 'upcoming' },
      { code: 'TNA', name: 'Thane', lat: 19.1860, lng: 72.9756, scheduled: '17:45', status: 'upcoming' },
      { code: 'PNV', name: 'Panvel', lat: 18.9894, lng: 73.1175, scheduled: '18:15', status: 'upcoming' },
      { code: 'KJT', name: 'Karjat', lat: 18.9100, lng: 73.3228, scheduled: '18:50', status: 'upcoming' },
      { code: 'LNL', name: 'Lonavala', lat: 18.7481, lng: 73.4072, scheduled: '19:25', status: 'upcoming' },
      { code: 'PUNE', name: 'Pune Junction', lat: 18.5289, lng: 73.8744, scheduled: '20:25', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12123',
    trainName: 'Deccan Queen',
    from: 'PUNE',
    to: 'CSMT',
    scheduledDeparture: '07:15',
    scheduledArrival: '10:30',
    actualDeparture: '07:15',
    expectedArrival: '10:30',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'Lonavala',
    nextStation: 'Karjat',
    platform: 1,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 18.7481, lng: 73.4072 },
    route: [
      { code: 'PUNE', name: 'Pune Junction', lat: 18.5289, lng: 73.8744, scheduled: '07:15', status: 'passed' },
      { code: 'SHV', name: 'Shivajinagar', lat: 18.5362, lng: 73.8509, scheduled: '07:22', status: 'passed' },
      { code: 'LNL', name: 'Lonavala', lat: 18.7481, lng: 73.4072, scheduled: '08:25', status: 'current' },
      { code: 'KJT', name: 'Karjat', lat: 18.9100, lng: 73.3228, scheduled: '09:00', status: 'upcoming' },
      { code: 'TNA', name: 'Thane', lat: 19.1860, lng: 72.9756, scheduled: '09:40', status: 'upcoming' },
      { code: 'DR', name: 'Dadar', lat: 19.0178, lng: 72.8478, scheduled: '10:10', status: 'upcoming' },
      { code: 'CSMT', name: 'Mumbai CST', lat: 18.9402, lng: 72.8355, scheduled: '10:30', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    from: 'BCT',
    to: 'NDLS',
    scheduledDeparture: '16:35',
    scheduledArrival: '08:35',
    actualDeparture: '16:55',
    expectedArrival: '08:55',
    status: 'delayed',
    delayMinutes: 20,
    delayReason: 'Late departure from Mumbai Central due to rake positioning delay',
    currentStation: 'Vadodara Junction',
    nextStation: 'Ratlam Junction',
    platform: 2,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 22.3098, lng: 73.1812 },
    route: [
      { code: 'BCT', name: 'Mumbai Central', lat: 18.9710, lng: 72.8194, scheduled: '16:35', status: 'passed' },
      { code: 'BRC', name: 'Vadodara Junction', lat: 22.3098, lng: 73.1812, scheduled: '21:10', status: 'current' },
      { code: 'RTM', name: 'Ratlam Junction', lat: 23.3315, lng: 75.0367, scheduled: '00:30', status: 'upcoming' },
      { code: 'KOTA', name: 'Kota Junction', lat: 25.1800, lng: 75.8648, scheduled: '03:00', status: 'upcoming' },
      { code: 'MTJ', name: 'Mathura Junction', lat: 27.4924, lng: 77.6737, scheduled: '06:00', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '08:35', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12952',
    trainName: 'New Delhi Rajdhani Express',
    from: 'NDLS',
    to: 'BCT',
    scheduledDeparture: '16:55',
    scheduledArrival: '08:35',
    actualDeparture: '16:55',
    expectedArrival: '08:35',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'New Delhi',
    nextStation: 'Mathura Junction',
    platform: 6,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 28.6428, lng: 77.2195 },
    route: [
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '16:55', status: 'current' },
      { code: 'MTJ', name: 'Mathura Junction', lat: 27.4924, lng: 77.6737, scheduled: '19:20', status: 'upcoming' },
      { code: 'KOTA', name: 'Kota Junction', lat: 25.1800, lng: 75.8648, scheduled: '22:30', status: 'upcoming' },
      { code: 'RTM', name: 'Ratlam Junction', lat: 23.3315, lng: 75.0367, scheduled: '01:15', status: 'upcoming' },
      { code: 'BRC', name: 'Vadodara Junction', lat: 22.3098, lng: 73.1812, scheduled: '04:30', status: 'upcoming' },
      { code: 'BCT', name: 'Mumbai Central', lat: 18.9710, lng: 72.8194, scheduled: '08:35', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express',
    from: 'HWH',
    to: 'NDLS',
    scheduledDeparture: '16:55',
    scheduledArrival: '10:00',
    actualDeparture: '17:25',
    expectedArrival: '11:30',
    status: 'delayed',
    delayMinutes: 90,
    delayReason: 'Fog and poor visibility in the Bihar-UP section causing speed restrictions',
    currentStation: 'Mughal Sarai Junction',
    nextStation: 'Prayagraj Junction',
    platform: 4,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 25.2832, lng: 83.1198 },
    route: [
      { code: 'HWH', name: 'Howrah Junction', lat: 22.5839, lng: 88.3425, scheduled: '16:55', status: 'passed' },
      { code: 'ASN', name: 'Asansol Junction', lat: 23.6888, lng: 86.9661, scheduled: '19:45', status: 'passed' },
      { code: 'GAY', name: 'Gaya Junction', lat: 24.7914, lng: 85.0002, scheduled: '22:30', status: 'passed' },
      { code: 'MGS', name: 'Mughal Sarai Jn', lat: 25.2832, lng: 83.1198, scheduled: '01:00', status: 'current' },
      { code: 'PRYJ', name: 'Prayagraj Junction', lat: 25.4358, lng: 81.8463, scheduled: '03:30', status: 'upcoming' },
      { code: 'CNB', name: 'Kanpur Central', lat: 26.4499, lng: 80.3319, scheduled: '05:30', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '10:00', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12621',
    trainName: 'Tamil Nadu Express',
    from: 'MAS',
    to: 'NDLS',
    scheduledDeparture: '22:00',
    scheduledArrival: '05:15',
    actualDeparture: '22:00',
    expectedArrival: '05:15',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'Vijayawada Junction',
    nextStation: 'Warangal',
    platform: 7,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 16.5193, lng: 80.6305 },
    route: [
      { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707, scheduled: '22:00', status: 'passed' },
      { code: 'BZA', name: 'Vijayawada Jn', lat: 16.5193, lng: 80.6305, scheduled: '04:30', status: 'current' },
      { code: 'WL', name: 'Warangal', lat: 18.0005, lng: 79.5880, scheduled: '07:00', status: 'upcoming' },
      { code: 'NGP', name: 'Nagpur Junction', lat: 21.1458, lng: 79.0882, scheduled: '13:00', status: 'upcoming' },
      { code: 'BPL', name: 'Bhopal Junction', lat: 23.2681, lng: 77.4124, scheduled: '19:30', status: 'upcoming' },
      { code: 'AGC', name: 'Agra Cantt', lat: 27.1591, lng: 78.0081, scheduled: '01:30', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '05:15', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12839',
    trainName: 'Chennai Mail',
    from: 'CSMT',
    to: 'MAS',
    scheduledDeparture: '21:40',
    scheduledArrival: '19:00',
    actualDeparture: null,
    expectedArrival: null,
    status: 'cancelled',
    delayMinutes: 0,
    delayReason: 'Cancelled due to track maintenance work between Pune and Solapur',
    currentStation: null,
    nextStation: null,
    platform: null,
    lastUpdated: new Date().toISOString(),
    currentPosition: null,
    route: [
      { code: 'CSMT', name: 'Mumbai CST', lat: 18.9402, lng: 72.8355, scheduled: '21:40', status: 'upcoming' },
      { code: 'PUNE', name: 'Pune Junction', lat: 18.5289, lng: 73.8744, scheduled: '01:15', status: 'upcoming' },
      { code: 'SUR', name: 'Solapur', lat: 17.6599, lng: 75.9064, scheduled: '06:00', status: 'upcoming' },
      { code: 'GDG', name: 'Gadag Junction', lat: 15.4168, lng: 75.6285, scheduled: '10:30', status: 'upcoming' },
      { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707, scheduled: '19:00', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '22691',
    trainName: 'Bengaluru Rajdhani Express',
    from: 'SBC',
    to: 'NDLS',
    scheduledDeparture: '20:00',
    scheduledArrival: '05:50',
    actualDeparture: '20:30',
    expectedArrival: '06:20',
    status: 'delayed',
    delayMinutes: 30,
    delayReason: 'Late departure from Bengaluru due to heavy evening traffic on connecting platforms',
    currentStation: 'Guntakal Junction',
    nextStation: 'Raichur',
    platform: 1,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 15.1710, lng: 77.3522 },
    route: [
      { code: 'SBC', name: 'KSR Bengaluru', lat: 12.9779, lng: 77.5710, scheduled: '20:00', status: 'passed' },
      { code: 'GTL', name: 'Guntakal Junction', lat: 15.1710, lng: 77.3522, scheduled: '00:30', status: 'current' },
      { code: 'SC', name: 'Secunderabad Jn', lat: 17.4344, lng: 78.5013, scheduled: '05:00', status: 'upcoming' },
      { code: 'NGP', name: 'Nagpur Junction', lat: 21.1458, lng: 79.0882, scheduled: '13:00', status: 'upcoming' },
      { code: 'BPL', name: 'Bhopal Junction', lat: 23.2681, lng: 77.4124, scheduled: '19:00', status: 'upcoming' },
      { code: 'AGC', name: 'Agra Cantt', lat: 27.1591, lng: 78.0081, scheduled: '01:30', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '05:50', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12259',
    trainName: 'Duronto Express',
    from: 'BCT',
    to: 'NDLS',
    scheduledDeparture: '23:05',
    scheduledArrival: '15:55',
    actualDeparture: '23:05',
    expectedArrival: '15:55',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'Ratlam Junction',
    nextStation: 'Kota Junction',
    platform: 8,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 23.3315, lng: 75.0367 },
    route: [
      { code: 'BCT', name: 'Mumbai Central', lat: 18.9710, lng: 72.8194, scheduled: '23:05', status: 'passed' },
      { code: 'BRC', name: 'Vadodara Junction', lat: 22.3098, lng: 73.1812, scheduled: '03:30', status: 'passed' },
      { code: 'RTM', name: 'Ratlam Junction', lat: 23.3315, lng: 75.0367, scheduled: '06:45', status: 'current' },
      { code: 'KOTA', name: 'Kota Junction', lat: 25.1800, lng: 75.8648, scheduled: '09:30', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '15:55', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12431',
    trainName: 'Trivandrum Rajdhani Express',
    from: 'TVC',
    to: 'NDLS',
    scheduledDeparture: '11:15',
    scheduledArrival: '17:25',
    actualDeparture: '11:15',
    expectedArrival: '17:25',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'Ernakulam Junction',
    nextStation: 'Kozhikode',
    platform: 2,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 9.9816, lng: 76.2999 },
    route: [
      { code: 'TVC', name: 'Trivandrum Central', lat: 8.4893, lng: 76.9521, scheduled: '11:15', status: 'passed' },
      { code: 'ERS', name: 'Ernakulam Junction', lat: 9.9816, lng: 76.2999, scheduled: '15:00', status: 'current' },
      { code: 'CLT', name: 'Kozhikode', lat: 11.2588, lng: 75.7804, scheduled: '19:00', status: 'upcoming' },
      { code: 'MAQ', name: 'Mangaluru Jn', lat: 12.8654, lng: 74.8426, scheduled: '22:30', status: 'upcoming' },
      { code: 'SWV', name: 'Sawantwadi Road', lat: 15.9034, lng: 73.8060, scheduled: '04:00', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '17:25', status: 'upcoming' },
    ],
  },
  {
    trainNumber: '12724',
    trainName: 'Telangana Express',
    from: 'HYB',
    to: 'NDLS',
    scheduledDeparture: '06:25',
    scheduledArrival: '08:30',
    actualDeparture: '06:25',
    expectedArrival: '08:30',
    status: 'on_time',
    delayMinutes: 0,
    delayReason: null,
    currentStation: 'Nagpur Junction',
    nextStation: 'Bhopal Junction',
    platform: 3,
    lastUpdated: new Date().toISOString(),
    currentPosition: { lat: 21.1458, lng: 79.0882 },
    route: [
      { code: 'HYB', name: 'Hyderabad Deccan', lat: 17.3616, lng: 78.4747, scheduled: '06:25', status: 'passed' },
      { code: 'SC', name: 'Secunderabad Jn', lat: 17.4344, lng: 78.5013, scheduled: '06:55', status: 'passed' },
      { code: 'NGP', name: 'Nagpur Junction', lat: 21.1458, lng: 79.0882, scheduled: '14:30', status: 'current' },
      { code: 'BPL', name: 'Bhopal Junction', lat: 23.2681, lng: 77.4124, scheduled: '21:00', status: 'upcoming' },
      { code: 'JHS', name: 'Jhansi Junction', lat: 25.4358, lng: 78.5685, scheduled: '00:30', status: 'upcoming' },
      { code: 'AGC', name: 'Agra Cantt', lat: 27.1591, lng: 78.0081, scheduled: '04:30', status: 'upcoming' },
      { code: 'NDLS', name: 'New Delhi', lat: 28.6428, lng: 77.2195, scheduled: '08:30', status: 'upcoming' },
    ],
  },
];

// Helper to get a train by number
export function getTrainByNumber(number) {
  return trains.find(t => t.trainNumber === number.toString().trim());
}

// Helper to search trains by name or number
export function searchTrains(query) {
  const q = query.toLowerCase().trim();
  return trains.filter(
    t =>
      t.trainNumber.includes(q) ||
      t.trainName.toLowerCase().includes(q) ||
      t.from.toLowerCase().includes(q) ||
      t.to.toLowerCase().includes(q)
  );
}

// Helper to find trains between two stations
export function findTrainsBetween(fromCode, toCode) {
  const from = fromCode.toUpperCase().trim();
  const to = toCode.toUpperCase().trim();
  return trains.filter(t => {
    const routeCodes = t.route.map(s => s.code);
    const fromIdx = routeCodes.indexOf(from);
    const toIdx = routeCodes.indexOf(to);
    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
  });
}

// Helper to get alternative trains for a delayed train
export function getAlternatives(trainNumber) {
  const train = getTrainByNumber(trainNumber);
  if (!train) return [];
  return trains.filter(
    t =>
      t.trainNumber !== trainNumber &&
      t.status !== 'cancelled' &&
      t.route.some(s => s.code === train.from) &&
      t.route.some(s => s.code === train.to)
  );
}

/* Create mock train data */
