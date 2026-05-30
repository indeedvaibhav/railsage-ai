// Active disruptions for the disruption banner
// These simulate real-time alerts for popular routes

export const disruptions = [
  {
    id: 'dis-001',
    type: 'signal',
    severity: 'moderate',
    title: {
      en: 'Signal repairs near Lonavala — Pune-Mumbai trains may be delayed',
      hi: 'लोनावाला के पास सिग्नल मरम्मत — पुणे-मुंबई ट्रेनों में देरी हो सकती है',
      ja: 'ロナヴァラ付近の信号修理 — プネー-ムンバイ間の列車に遅延の可能性',
    },
    description: {
      en: 'Signal maintenance work between Lonavala and Karjat is causing 30-45 minute delays on Pune-Mumbai trains today. Work is expected to finish by evening.',
      hi: 'लोनावाला और कर्जत के बीच सिग्नल मरम्मत कार्य के कारण आज पुणे-मुंबई ट्रेनों में 30-45 मिनट की देरी हो रही है। काम शाम तक पूरा होने की उम्मीद है।',
      ja: 'ロナヴァラ～カルジャト間の信号保守作業により、本日プネー-ムンバイ間の列車に30～45分の遅延が発生しています。作業は夕方までに完了予定です。',
    },
    affectedRoutes: ['PUNE-CSMT', 'CSMT-PUNE'],
    affectedTrains: ['12027', '12028', '12123'],
    startTime: '2024-01-15T06:00:00',
    estimatedEnd: '2024-01-15T18:00:00',
    active: true,
  },
  {
    id: 'dis-002',
    type: 'maintenance',
    severity: 'high',
    title: {
      en: 'Track work between Pune and Solapur — some trains cancelled',
      hi: 'पुणे और सोलापुर के बीच ट्रैक कार्य — कुछ ट्रेनें रद्द',
      ja: 'プネー～ソラプール間の線路工事 — 一部列車運休',
    },
    description: {
      en: 'Planned track maintenance between Pune and Solapur has led to cancellation of Chennai Mail (12839) today. The work will continue through tomorrow.',
      hi: 'पुणे और सोलापुर के बीच नियोजित ट्रैक रखरखाव के कारण आज चेन्नई मेल (12839) रद्द कर दी गई है। कार्य कल तक जारी रहेगा।',
      ja: 'プネー～ソラプール間の予定線路保守により、本日のチェンナイメール（12839）は運休となりました。工事は明日まで続きます。',
    },
    affectedRoutes: ['CSMT-MAS'],
    affectedTrains: ['12839'],
    startTime: '2024-01-14T22:00:00',
    estimatedEnd: '2024-01-16T06:00:00',
    active: true,
  },
  {
    id: 'dis-003',
    type: 'weather',
    severity: 'moderate',
    title: {
      en: 'Fog advisory for North India — trains from Delhi may face delays',
      hi: 'उत्तर भारत में कोहरा चेतावनी — दिल्ली से ट्रेनों में देरी हो सकती है',
      ja: '北インドの霧注意報 — デリー発の列車に遅延の可能性',
    },
    description: {
      en: 'Dense fog in the Delhi-Agra-Kanpur corridor is affecting visibility. Trains in this area are running with speed restrictions. Expect 30-90 minute delays.',
      hi: 'दिल्ली-आगरा-कानपुर गलियारे में घने कोहरे से दृश्यता प्रभावित हो रही है। इस क्षेत्र में ट्रेनें गति प्रतिबंधों के साथ चल रही हैं। 30-90 मिनट की देरी की उम्मीद करें।',
      ja: 'デリー～アーグラ～カーンプル回廊の濃霧が視界に影響しています。この区間の列車は速度制限で運行中です。30～90分の遅延が見込まれます。',
    },
    affectedRoutes: ['NDLS-HWH', 'HWH-NDLS', 'NDLS-BCT'],
    affectedTrains: ['12301', '12951', '12952'],
    startTime: '2024-01-15T00:00:00',
    estimatedEnd: '2024-01-15T10:00:00',
    active: true,
  },
];

// Get active disruptions
export function getActiveDisruptions() {
  return disruptions.filter(d => d.active);
}

// Get disruptions for a specific train
export function getDisruptionsForTrain(trainNumber) {
  return disruptions.filter(d => d.active && d.affectedTrains.includes(trainNumber));
}

// Get disruptions for a route
export function getDisruptionsForRoute(fromCode, toCode) {
  const routeKey = `${fromCode}-${toCode}`;
  return disruptions.filter(d => d.active && d.affectedRoutes.includes(routeKey));
}

/* Create mock disruption data */
