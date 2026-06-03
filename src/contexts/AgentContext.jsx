import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BOOTSTRAP_METRICS,
} from '../data/bootstrapData';

const AgentContext = createContext();
export const useAgent = () => useContext(AgentContext);

/* ──────────────────────────────────────────────
   SCENARIO DATA — 4 scenarios × 9 steps each
   ────────────────────────────────────────────── */

const SCENARIOS = {
  signal_failure: {
    name: 'Signal Failure',
    title: 'Signal Failure at Vadodara Junction',
    zone: 'Western Railway (WR)',
    description: 'Block Section 14B — signalling equipment malfunction causing corridor-wide delays',
    steps: [
      { type: 'scan', message: 'Scanning network telemetry feeds across Western Railway zone' },
      { type: 'alert', message: 'ALERT: Signal failure detected at Vadodara Junction — Block Section 14B offline' },
      { type: 'monitor', message: 'Identifying affected trains: 12951, 12952, 22691 on Vadodara corridor' },
      { type: 'weather', message: 'Weather check: Clear conditions — fault is equipment-related, not weather' },
      { type: 'monitor', message: 'Calculating cascade delay impact: 4 services affected, 45-90 min delays' },
      { type: 'alert', message: 'Proposing reroute: 12951 Mumbai Rajdhani via Godhra-Dahod bypass line' },
      { type: 'monitor', message: 'Revised ETA for 12951: New Delhi arrival shifted from 08:35 to 09:15' },
      { type: 'scan', message: 'Generating trilingual passenger announcements for affected services' },
      { type: 'monitor', message: 'Maintenance ticket #MTX-2847 raised — crew dispatched to Block Section 14B' },
    ],
    announcements: [
      {
        id: 'ann-sf-en', language: 'en', flag: '🇬🇧', flagColor: '#3B82F6',
        title: 'Service Update',
        text: 'Attention passengers: Train 12951 Mumbai Rajdhani Express has been rerouted via Godhra-Dahod bypass due to signal failure at Vadodara Junction. Revised arrival at New Delhi is 09:15. We apologize for the inconvenience.',
      },
      {
        id: 'ann-sf-hi', language: 'hi', flag: '🇮🇳', flagColor: '#F97316',
        title: 'सेवा अपडेट',
        text: 'यात्रियों का ध्यान: ट्रेन 12951 मुंबई राजधानी एक्सप्रेस को वडोदरा जंक्शन पर सिग्नल खराबी के कारण गोधरा-दाहोद बाईपास से रूट बदल दिया गया है। नई दिल्ली पर संशोधित आगमन समय 09:15 है। असुविधा के लिए खेद है।',
      },
      {
        id: 'ann-sf-ja', language: 'ja', flag: '🇯🇵', flagColor: '#EF4444',
        title: '運行情報',
        text: 'お客様にお知らせいたします。列車12951ムンバイ・ラージダーニー急行は、ヴァドーダラー・ジャンクションでの信号故障により、ゴドラ・ダーホド迂回路線に変更されました。ニューデリーへの到着予定時刻は09:15に変更となります。ご不便をおかけして申し訳ございません。',
      },
    ],
    ticket: { ticketNumber: 'MTX-2847', zone: 'Western Railway (WR)', faultType: 'Signal System Malfunction', frequency: 'First occurrence in 90 days', dateRaised: '14 Jun 2026, 16:42 IST', status: 'OPEN' },
  },

  storm: {
    name: 'Cyclone Warning',
    title: 'Cyclonic Storm Alert — Konkan Coast',
    zone: 'Konkan Railway (KR)',
    description: 'Severe cyclonic storm approaching Konkan coast with wind speeds 85-100 km/h',
    steps: [
      { type: 'weather', message: 'Monitoring IMD weather bulletin for severe weather alerts' },
      { type: 'alert', message: 'ALERT: Cyclonic storm warning for Konkan coast — wind speeds 85-100 km/h' },
      { type: 'scan', message: 'Scanning affected routes: Mumbai-Goa corridor, Konkan Railway section' },
      { type: 'monitor', message: 'Identifying at-risk trains: 12133 Mangalore Exp, 10111 Konkan Kanya' },
      { type: 'weather', message: 'Calculating safe operating envelope — speed restriction to 40 km/h advised' },
      { type: 'alert', message: 'Recommending precautionary cancellation of 3 coastal services' },
      { type: 'monitor', message: 'Activating alternative routing via inland Pune-Belgaum corridor' },
      { type: 'scan', message: 'Generating emergency announcements with safety advisories' },
      { type: 'monitor', message: 'Alerting station masters at 12 coastal stations for platform safety' },
    ],
    announcements: [
      {
        id: 'ann-st-en', language: 'en', flag: '🇬🇧', flagColor: '#3B82F6',
        title: 'Weather Emergency',
        text: 'Due to the approaching cyclonic storm on the Konkan coast, trains 12133 Mangalore Express, 10111 Konkan Kanya, and 10103 Mandovi Express are cancelled today. Passengers are advised to check alternative services via the Pune-Belgaum route.',
      },
      {
        id: 'ann-st-hi', language: 'hi', flag: '🇮🇳', flagColor: '#F97316',
        title: 'मौसम आपातकाल',
        text: 'कोंकण तट पर आने वाले चक्रवाती तूफान के कारण ट्रेन 12133 मंगलौर एक्सप्रेस, 10111 कोंकण कन्या और 10103 मांडवी एक्सप्रेस आज रद्द हैं। यात्रियों से अनुरोध है कि वे पुणे-बेलगाम मार्ग से वैकल्पिक सेवाएं देखें।',
      },
      {
        id: 'ann-st-ja', language: 'ja', flag: '🇯🇵', flagColor: '#EF4444',
        title: '気象警報',
        text: 'コンカン海岸に接近中のサイクロンのため、列車12133マンガロール急行、10111コンカン・カンヤ、10103マンドヴィ急行は本日運休となりました。プネー・ベルガウム経由の代替便をご確認ください。',
      },
    ],
    ticket: { ticketNumber: 'MTX-3105', zone: 'Konkan Railway (KR)', faultType: 'Weather Emergency Protocol', frequency: 'Seasonal — monsoon', dateRaised: '14 Jun 2026, 16:55 IST', status: 'OPEN' },
  },

  track_block: {
    name: 'Track Block',
    title: 'Emergency Track Block — Itarsi Junction',
    zone: 'West Central Railway (WCR)',
    description: 'Rail fracture detected near Itarsi Junction at km marker 648.3',
    steps: [
      { type: 'scan', message: 'Receiving emergency track inspection report from Section Engineer' },
      { type: 'alert', message: 'ALERT: Rail fracture detected near Itarsi Junction — km marker 648.3' },
      { type: 'monitor', message: 'Imposing emergency speed restriction — all trains to halt at outer signal' },
      { type: 'monitor', message: '6 trains between Bhopal-Itarsi affected by block section closure' },
      { type: 'scan', message: 'Estimating repair timeline: Welding crew ETA 45 min, block ~2 hours' },
      { type: 'alert', message: 'Diverting northbound trains via Bina-Katni alternative route' },
      { type: 'monitor', message: 'Coordinating with Bhopal Division control room for platform allocation' },
      { type: 'scan', message: 'Issuing delay advisories: 60-120 min delays on Delhi-Chennai corridor' },
      { type: 'monitor', message: 'Maintenance ticket #MTX-3012 raised — priority track repair, Zone WCR' },
    ],
    announcements: [
      {
        id: 'ann-tb-en', language: 'en', flag: '🇬🇧', flagColor: '#3B82F6',
        title: 'Track Emergency',
        text: 'A rail fracture has been detected near Itarsi Junction. Trains on the Delhi-Chennai corridor may be delayed by 60-120 minutes. Northbound services are being diverted via Bina-Katni. We regret the inconvenience.',
      },
      {
        id: 'ann-tb-hi', language: 'hi', flag: '🇮🇳', flagColor: '#F97316',
        title: 'ट्रैक आपातकाल',
        text: 'इटारसी जंक्शन के पास रेल फ्रैक्चर का पता चला है। दिल्ली-चेन्नई गलियारे पर ट्रेनों में 60-120 मिनट की देरी हो सकती है। उत्तर दिशा की सेवाएं बीना-कटनी मार्ग से diverted की जा रही हैं।',
      },
      {
        id: 'ann-tb-ja', language: 'ja', flag: '🇯🇵', flagColor: '#EF4444',
        title: '線路緊急情報',
        text: 'イタルシ・ジャンクション付近でレール破断が検出されました。デリー・チェンナイ回廊の列車は60〜120分の遅延が予想されます。北行きの列車はビナ・カトニ経由に迂回中です。ご迷惑をおかけして申し訳ございません。',
      },
    ],
    ticket: { ticketNumber: 'MTX-3012', zone: 'West Central Railway (WCR)', faultType: 'Rail Fracture — Emergency', frequency: 'Second occurrence in 180 days', dateRaised: '14 Jun 2026, 17:10 IST', status: 'OPEN' },
  },

  crowd_surge: {
    name: 'Crowd Surge',
    title: 'Crowd Surge Alert — New Delhi Station',
    zone: 'Northern Railway (NR)',
    description: 'Critical crowd density on platforms 8-12, festival return traffic',
    steps: [
      { type: 'scan', message: 'Monitoring CCTV feeds and crowd density sensors at major terminals' },
      { type: 'alert', message: 'ALERT: Crowd density critical at New Delhi Station — platforms 8-12 at 95%' },
      { type: 'monitor', message: 'Root cause: Festival return traffic coinciding with 4 delayed Rajdhanis' },
      { type: 'alert', message: 'Risk assessment: Density exceeds safe limit, stampede risk elevated' },
      { type: 'monitor', message: 'Activating crowd management — additional RPF deployed to platforms 8-12' },
      { type: 'scan', message: 'Recommending train holding at outer signals to stagger platform arrivals' },
      { type: 'monitor', message: 'Diverting platforms: 12301 → Platform 3, 12951 → Platform 16' },
      { type: 'scan', message: 'Broadcasting crowd advisory on station PA system and mobile alerts' },
      { type: 'monitor', message: 'Medical teams alerted — station emergency response on standby' },
    ],
    announcements: [
      {
        id: 'ann-cs-en', language: 'en', flag: '🇬🇧', flagColor: '#3B82F6',
        title: 'Crowd Advisory',
        text: 'New Delhi Station is experiencing heavy crowding on platforms 8-12. Some trains may arrive at different platforms than scheduled. Please check display boards and follow RPF instructions. Allow extra time for boarding.',
      },
      {
        id: 'ann-cs-hi', language: 'hi', flag: '🇮🇳', flagColor: '#F97316',
        title: 'भीड़ चेतावनी',
        text: 'नई दिल्ली स्टेशन पर प्लेटफॉर्म 8-12 पर भारी भीड़ है। कुछ ट्रेनें निर्धारित से अलग प्लेटफॉर्म पर आ सकती हैं। कृपया डिस्प्ले बोर्ड देखें और RPF के निर्देशों का पालन करें।',
      },
      {
        id: 'ann-cs-ja', language: 'ja', flag: '🇯🇵', flagColor: '#EF4444',
        title: '混雑情報',
        text: 'ニューデリー駅のプラットフォーム8〜12は大変混雑しております。一部の列車は予定とは異なるプラットフォームに到着する場合があります。電光掲示板をご確認の上、RPFの指示に従ってください。',
      },
    ],
    ticket: { ticketNumber: 'MTX-3201', zone: 'Northern Railway (NR)', faultType: 'Crowd Management Protocol', frequency: 'Seasonal — festival peak', dateRaised: '14 Jun 2026, 17:30 IST', status: 'OPEN' },
  },
};

/* initial steps — pre-populated so dashboard isn't empty */
const now = Date.now();
const INITIAL_STEPS = SCENARIOS.signal_failure.steps.map((step, i) => ({
  id: `init-${i}`,
  step: i + 1,
  type: step.type,
  message: step.message,
  status: i < 8 ? 'completed' : 'completed',
  timestamp: new Date(now - (9 - i) * 30000).toISOString(),
}));

const INITIAL_ANNOUNCEMENTS = SCENARIOS.signal_failure.announcements;
const INITIAL_TICKET = SCENARIOS.signal_failure.ticket;

/* monitor messages for background loop */
const MONITOR_MESSAGES = [
  'Refreshing live status for priority Rajdhani & Shatabdi services',
  'Cross-referencing IRCTC delay feeds with station arrival logs',
  'Monitoring fog corridor — checking speed restrictions on NDLS routes',
  'Scanning Western Railway section for signal maintenance impacts',
  'Updating platform assignments for Mumbai Central departures',
  'Evaluating alternate routes for delayed Pune–Mumbai corridor trains',
];

/* ──────────────────────────────────────────────
   PROVIDER
   ────────────────────────────────────────────── */

export function AgentProvider({ children }) {
  const [metrics, setMetrics] = useState(BOOTSTRAP_METRICS);
  const [reasoningSteps, setReasoningSteps] = useState(INITIAL_STEPS);
  const [activeScenario, setActiveScenario] = useState('signal_failure');
  const [incident, setIncident] = useState({
    title: SCENARIOS.signal_failure.title,
    scenario: 'signal_failure',
    status: 'ACTIVE',
    zone: SCENARIOS.signal_failure.zone,
    description: SCENARIOS.signal_failure.description,
  });
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [maintenanceTicket, setMaintenanceTicket] = useState(INITIAL_TICKET);
  const [isRunning, setIsRunning] = useState(true);
  const [overrideInput, setOverrideInput] = useState(false);

  const loopRef = useRef(null);
  const messageIndex = useRef(0);
  const scenarioTimers = useRef([]);

  /* background monitoring loop */
  const startAgentLoop = useCallback(() => {
    if (loopRef.current) return;
    setIsRunning(true);
    loopRef.current = setInterval(() => {
      const message = MONITOR_MESSAGES[messageIndex.current % MONITOR_MESSAGES.length];
      messageIndex.current += 1;
      setMetrics((prev) => ({
        ...prev,
        activeTrains: Math.max(840, Math.min(860, prev.activeTrains + (Math.random() > 0.5 ? 1 : -1))),
        onTimePercent: Math.min(78, Math.max(68, prev.onTimePercent + (Math.random() > 0.6 ? 1 : -1))),
        delayedPercent: Math.min(28, Math.max(18, prev.delayedPercent + (Math.random() > 0.5 ? 1 : -1))),
      }));
    }, 12000);
  }, []);

  const stopAgentLoop = useCallback(() => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
    setIsRunning(false);
  }, []);

  useEffect(() => { startAgentLoop(); return () => stopAgentLoop(); }, [startAgentLoop, stopAgentLoop]);

  /* trigger a scenario */
  const triggerScenario = useCallback((key) => {
    const scenario = SCENARIOS[key];
    if (!scenario) return;

    // clear any pending timers from previous scenario
    scenarioTimers.current.forEach(clearTimeout);
    scenarioTimers.current = [];

    setActiveScenario(key);
    setReasoningSteps([]);
    setOverrideInput(false);
    setIncident({
      title: scenario.title,
      scenario: key,
      status: 'ACTIVE',
      zone: scenario.zone,
      description: scenario.description,
    });

    // play steps one by one
    scenario.steps.forEach((step, i) => {
      const timer = setTimeout(() => {
        setReasoningSteps((prev) => {
          const updated = prev.map((s) => ({ ...s, status: 'completed' }));
          return [...updated, {
            id: `${key}-${i}-${Date.now()}`,
            step: i + 1,
            type: step.type,
            message: step.message,
            status: 'active',
            timestamp: new Date().toISOString(),
          }];
        });
      }, i * 900);
      scenarioTimers.current.push(timer);
    });

    // after all steps complete, finalize
    const finalTimer = setTimeout(() => {
      setReasoningSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
      setAnnouncements(scenario.announcements);
      setMaintenanceTicket(scenario.ticket);
    }, scenario.steps.length * 900 + 400);
    scenarioTimers.current.push(finalTimer);
  }, []);

  /* approve incident */
  const approveIncident = useCallback(() => {
    setIncident((prev) => ({ ...prev, status: 'RESOLVED' }));
    setReasoningSteps((prev) => [...prev, {
      id: `approve-${Date.now()}`,
      step: prev.length + 1,
      type: 'scan',
      message: '✓ Incident approved and resolved by operator — all rerouting confirmed',
      status: 'completed',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  /* override incident */
  const overrideIncident = useCallback((alternativeText) => {
    setOverrideInput(false);
    setIncident((prev) => ({ ...prev, status: 'RESOLVED' }));
    setReasoningSteps((prev) => [...prev, {
      id: `override-${Date.now()}`,
      step: prev.length + 1,
      type: 'alert',
      message: `⚡ Operator override: ${alternativeText}`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const showOverrideInput = useCallback(() => setOverrideInput(true), []);
  const hideOverrideInput = useCallback(() => setOverrideInput(false), []);

  /* backward-compatible reasoningEvents (for any component still using it) */
  const reasoningEvents = useMemo(() =>
    reasoningSteps.slice(-3).reverse().map((s) => ({
      id: s.id,
      type: s.type,
      message: s.message,
      timestamp: s.timestamp,
    })),
  [reasoningSteps]);

  const value = useMemo(() => ({
    metrics,
    reasoningSteps,
    reasoningEvents,
    activeScenario,
    incident,
    announcements,
    maintenanceTicket,
    isRunning,
    overrideInput,
    triggerScenario,
    approveIncident,
    overrideIncident,
    showOverrideInput,
    hideOverrideInput,
  }), [metrics, reasoningSteps, reasoningEvents, activeScenario, incident, announcements, maintenanceTicket, isRunning, overrideInput, triggerScenario, approveIncident, overrideIncident, showOverrideInput, hideOverrideInput]);

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

/* Setup Agent context */

/* Define 4 scenario events */
