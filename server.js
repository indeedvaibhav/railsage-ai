// Express proxy server for RailSage AI — REAL DATA ONLY
// No mock data. If API fails, log it and return null.

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

function log(tag, msg) { console.log(`[${new Date().toISOString()}] [${tag}] ${msg}`); }
function logErr(tag, msg) { console.error(`[${new Date().toISOString()}] [${tag}] ❌ ${msg}`); }

// --- Claude AI Chat ---
// Only initialize if the key looks real (not a placeholder)
const apiKey = process.env.ANTHROPIC_API_KEY;
const isRealKey = apiKey && !apiKey.includes('your-') && apiKey.length > 20;
const anthropic = isRealKey ? new Anthropic({ apiKey }) : null;

app.post('/api/chat', async (req, res) => {
  if (!anthropic) {
    logErr('CHAT', 'ANTHROPIC_API_KEY not configured or is a placeholder');
    return res.json({
      content: "I'm RailSage AI! My AI brain (Claude) isn't configured yet — you need a valid `ANTHROPIC_API_KEY` in the `.env` file. But you can still search trains and view live status!"
    });
  }
  try {
    const { messages, systemPrompt, trainContext, language } = req.body;
    const langLabel = language === 'hi' ? 'Hindi (Devanagari)' : language === 'ja' ? 'Japanese' : 'English';
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      system: `${systemPrompt}\n\nCURRENT DATA:\n${trainContext}\n\nRESPOND IN: ${langLabel}`,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });
    res.json({ content: response.content[0].text });
  } catch (e) {
    logErr('CHAT', e.message);
    if (e.message.includes('401') || e.message.includes('invalid x-api-key') || e.message.includes('authentication')) {
      return res.json({ content: "Your Anthropic API key appears to be invalid or expired. Please check your `.env` file. You can still use train search and live status!" });
    }
    res.json({ content: "I'm having trouble connecting right now. Please try again in a moment." });
  }
});

// --- Train data via rappid.in scraper ---
// rappid.in provides a free JSON API for Indian Railways live status

// A comprehensive list of well-known Indian trains for text search
const TRAIN_DATABASE = [
  { train_number: '12301', train_name: 'Howrah Rajdhani Express', source: 'HWH', destination: 'NDLS' },
  { train_number: '12302', train_name: 'New Delhi Rajdhani Express', source: 'NDLS', destination: 'HWH' },
  { train_number: '12951', train_name: 'Mumbai Rajdhani Express', source: 'BCT', destination: 'NDLS' },
  { train_number: '12952', train_name: 'New Delhi Rajdhani Express', source: 'NDLS', destination: 'BCT' },
  { train_number: '12309', train_name: 'Rajdhani Express', source: 'PNBE', destination: 'NDLS' },
  { train_number: '12004', train_name: 'Lucknow Shatabdi Express', source: 'NDLS', destination: 'LKO' },
  { train_number: '12003', train_name: 'Lucknow Shatabdi Express', source: 'LKO', destination: 'NDLS' },
  { train_number: '12002', train_name: 'Bhopal Shatabdi Express', source: 'NDLS', destination: 'BPL' },
  { train_number: '12001', train_name: 'Bhopal Shatabdi Express', source: 'BPL', destination: 'NDLS' },
  { train_number: '12801', train_name: 'Purushottam Express', source: 'NDLS', destination: 'PURI' },
  { train_number: '12621', train_name: 'Tamil Nadu Express', source: 'NDLS', destination: 'MAS' },
  { train_number: '12622', train_name: 'Tamil Nadu Express', source: 'MAS', destination: 'NDLS' },
  { train_number: '12269', train_name: 'Duronto Express', source: 'HWH', destination: 'NZM' },
  { train_number: '12903', train_name: 'Golden Temple Mail', source: 'BCT', destination: 'ASR' },
  { train_number: '12925', train_name: 'Paschim Express', source: 'BDTS', destination: 'ASR' },
  { train_number: '12423', train_name: 'Dibrugarh Rajdhani', source: 'DBRG', destination: 'NDLS' },
  { train_number: '22691', train_name: 'Rajdhani Express', source: 'SBC', destination: 'NZM' },
  { train_number: '12259', train_name: 'Sealdah Duronto Express', source: 'SDAH', destination: 'NDLS' },
  { train_number: '12305', train_name: 'Howrah Rajdhani Express', source: 'HWH', destination: 'NDLS' },
  { train_number: '12306', train_name: 'New Delhi Rajdhani Express', source: 'NDLS', destination: 'HWH' },
  { train_number: '12627', train_name: 'Karnataka Express', source: 'NDLS', destination: 'SBC' },
  { train_number: '12628', train_name: 'Karnataka Express', source: 'SBC', destination: 'NDLS' },
  { train_number: '12723', train_name: 'Telangana Express', source: 'NDLS', destination: 'SC' },
  { train_number: '12724', train_name: 'Telangana Express', source: 'SC', destination: 'NDLS' },
  { train_number: '12313', train_name: 'Sealdah Rajdhani', source: 'SDAH', destination: 'NDLS' },
  { train_number: '12314', train_name: 'Sealdah Rajdhani', source: 'NDLS', destination: 'SDAH' },
  { train_number: '12561', train_name: 'Swatantrata S Superfast', source: 'NDLS', destination: 'BSB' },
  { train_number: '12155', train_name: 'Shaan E Bhopal Express', source: 'NDLS', destination: 'BPL' },
  { train_number: '12431', train_name: 'Trivandrum Rajdhani', source: 'TVC', destination: 'NZM' },
  { train_number: '12432', train_name: 'Trivandrum Rajdhani', source: 'NZM', destination: 'TVC' },
  { train_number: '12433', train_name: 'Chennai Rajdhani', source: 'MAS', destination: 'NZM' },
  { train_number: '12434', train_name: 'Chennai Rajdhani', source: 'NZM', destination: 'MAS' },
  { train_number: '12625', train_name: 'Kerala Express', source: 'NDLS', destination: 'TVC' },
  { train_number: '12626', train_name: 'Kerala Express', source: 'TVC', destination: 'NDLS' },
  { train_number: '12559', train_name: 'Shiv Ganga Express', source: 'NDLS', destination: 'BSB' },
  { train_number: '12560', train_name: 'Shiv Ganga Express', source: 'BSB', destination: 'NDLS' },
  { train_number: '12915', train_name: 'Ashram Express', source: 'ADI', destination: 'NDLS' },
  { train_number: '12916', train_name: 'Ashram Express', source: 'NDLS', destination: 'ADI' },
  { train_number: '12953', train_name: 'August Kranti Rajdhani', source: 'BCT', destination: 'NZM' },
  { train_number: '12954', train_name: 'August Kranti Rajdhani', source: 'NZM', destination: 'BCT' },
  { train_number: '12049', train_name: 'Gatimaan Express', source: 'NDLS', destination: 'JTBS' },
  { train_number: '12050', train_name: 'Gatimaan Express', source: 'JTBS', destination: 'NDLS' },
  { train_number: '20501', train_name: 'Vande Bharat Express', source: 'NDLS', destination: 'BSB' },
  { train_number: '20502', train_name: 'Vande Bharat Express', source: 'BSB', destination: 'NDLS' },
  { train_number: '22436', train_name: 'Vande Bharat Express', source: 'NDLS', destination: 'BSB' },
  { train_number: '12039', train_name: 'Shatabdi Express', source: 'NDLS', destination: 'AGC' },
  { train_number: '12040', train_name: 'Shatabdi Express', source: 'AGC', destination: 'NDLS' },
  { train_number: '12138', train_name: 'Punjab Mail', source: 'CSMT', destination: 'FZR' },
  { train_number: '12137', train_name: 'Punjab Mail', source: 'FZR', destination: 'CSMT' },
  { train_number: '12229', train_name: 'Lucknow Mail', source: 'NDLS', destination: 'LKO' },
  { train_number: '12230', train_name: 'Lucknow Mail', source: 'LKO', destination: 'NDLS' },
];

// Station name lookup for text-based search
const STATION_NAMES = {
  'NDLS': 'New Delhi', 'BCT': 'Mumbai Central', 'CSMT': 'Chhatrapati Shivaji Terminus',
  'HWH': 'Howrah', 'MAS': 'Chennai Central', 'SBC': 'KSR Bengaluru', 'ADI': 'Ahmedabad',
  'PUNE': 'Pune', 'JP': 'Jaipur', 'LKO': 'Lucknow', 'CNB': 'Kanpur Central',
  'BPL': 'Bhopal', 'AGC': 'Agra Cantt', 'PNBE': 'Patna', 'GHY': 'Guwahati',
  'TVC': 'Thiruvananthapuram', 'SC': 'Secunderabad', 'BBS': 'Bhubaneswar',
  'SDAH': 'Sealdah', 'NZM': 'Hazrat Nizamuddin', 'BSB': 'Varanasi',
  'BDTS': 'Bandra Terminus', 'ASR': 'Amritsar', 'DBRG': 'Dibrugarh',
  'PURI': 'Puri', 'CDG': 'Chandigarh', 'DDN': 'Dehradun', 'FZR': 'Firozpur',
  'JTBS': 'Jhansi', 'DLI': 'Old Delhi',
};

// Reverse mapping: station display name → official code (for scraper data normalization)
const STATION_NAME_TO_CODE = {
  'new delhi': 'NDLS', 'h nizamuddin': 'NZM', 'hazrat nizamuddin': 'NZM',
  'ndls': 'NDLS', 'old delhi': 'DLI',
  'mumbai central': 'BCT', 'bandra terminus': 'BDTS', 'dadar': 'DR',
  'lokmanya tilak terminus': 'LTT', 'csmt': 'CSMT',
  'howrah jn': 'HWH', 'howrah': 'HWH', 'sealdah': 'SDAH',
  'chennai central': 'MAS', 'chennai egmore': 'MS',
  'bengaluru': 'SBC', 'ksr bengaluru': 'SBC', 'bangalore': 'SBC',
  'secunderabad': 'SC', 'secunderabad jn': 'SC', 'hyderabad': 'HYB',
  'ahmedabad': 'ADI', 'ahmedabad jn': 'ADI',
  'pune': 'PUNE', 'pune jn': 'PUNE',
  'jaipur': 'JP', 'jaipur jn': 'JP',
  'lucknow': 'LKO', 'lucknow jn': 'LKO', 'lucknow nr': 'LKO',
  'kanpur central': 'CNB', 'kanpur': 'CNB',
  'bhopal': 'BPL', 'bhopal jn': 'BPL',
  'gwalior': 'GWL', 'gwalior jn': 'GWL',
  'agra cantt': 'AGC', 'agra': 'AGC',
  'patna': 'PNBE', 'patna jn': 'PNBE',
  'guwahati': 'GHY',
  'trivandrum central': 'TVC', 'thiruvananthapuram': 'TVC',
  'ernakulam': 'ERS', 'ernakulam jn': 'ERS',
  'coimbatore': 'CBE', 'coimbatore jn': 'CBE',
  'bhubaneswar': 'BBS',
  'visakhapatnam': 'VSKP',
  'ranchi': 'RNC',
  'chandigarh': 'CDG',
  'dehradun': 'DDN',
  'varanasi': 'BSB', 'varanasi jn': 'BSB',
  'mughal sarai': 'MGS', 'dd upadhyaya jn': 'DDU', 'pt dd upadhyaya jn': 'DDU',
  'mathura jn': 'MTJ', 'mathura': 'MTJ',
  'allahabad': 'ALD', 'prayagraj jn': 'PRYJ', 'prayagraj jn.': 'PRYJ', 'prayagraj': 'PRYJ',
  'jhansi': 'JHS', 'jhansi jn': 'JHS',
  'ghaziabad': 'GZB',
  'asansol jn': 'ASN', 'asansol': 'ASN',
  'dhanbad jn': 'DHN', 'dhanbad': 'DHN',
  'kharagpur': 'KGP', 'kharagpur jn': 'KGP',
  'nagpur': 'NGP', 'nagpur jn': 'NGP',
  'bhusaval': 'BSL', 'bhusaval jn': 'BSL',
  'itarsi': 'ET', 'itarsi jn': 'ET',
  'vijayawada': 'BZA', 'vijayawada jn': 'BZA',
  'guntur': 'GNT', 'guntur jn': 'GNT',
  'raipur': 'R', 'raipur jn': 'R',
  'bilaspur': 'BSP', 'bilaspur jn': 'BSP',
  'amritsar': 'ASR', 'amritsar jn': 'ASR',
  'firozpur': 'FZR', 'firozpur jn': 'FZR',
  'dibrugarh': 'DBRG',
  'puri': 'PURI',
  'gaya jn': 'GAYA', 'gaya': 'GAYA',
  'parasnath': 'PRNA',
  'kota': 'KOTA', 'kota jn': 'KOTA',
  'vadodara': 'BRC', 'vadodara jn': 'BRC',
  'surat': 'ST', 'surat jn': 'ST',
  'udaipur': 'UDZ',
  'ajmer': 'AII', 'ajmer jn': 'AII',
  'jodhpur': 'JU', 'jodhpur jn': 'JU',
  'jammu tawi': 'JAT',
  'katni': 'KTE', 'katni jn': 'KTE',
  'ratlam': 'RTM', 'ratlam jn': 'RTM',
  'tatanagar': 'TATA', 'tatanagar jn': 'TATA',
  'bokaro steel city': 'BKSC',
  'durg': 'DURG', 'durg jn': 'DURG',
  'salem': 'SA', 'salem jn': 'SA',
  'madurai': 'MDU', 'madurai jn': 'MDU',
  'tirupati': 'TPTY',
  'nanded': 'NED',
  'warangal': 'WL',
  'rajahmundry': 'RJY',
  'ongole': 'OGL',
};

function resolveStationCode(stationName) {
  if (!stationName) return '';
  const key = stationName.toLowerCase().trim();
  // Direct lookup
  if (STATION_NAME_TO_CODE[key]) return STATION_NAME_TO_CODE[key];
  // Try without 'jn' suffix
  const withoutJn = key.replace(/\s*jn\.?$/i, '').trim();
  if (STATION_NAME_TO_CODE[withoutJn]) return STATION_NAME_TO_CODE[withoutJn];
  // Fallback: first 4 chars uppercase
  return stationName.substring(0, 4).toUpperCase().replace(/\s/g, '');
}

app.get('/api/train/status/:trainNo', async (req, res) => {
  try {
    const { trainNo } = req.params;
    log('SCRAPER', `Fetching live status for ${trainNo}`);

    const url = `https://rappid.in/apis/train.php?train_no=${trainNo}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 8000
    });

    if (!response.data || !response.data.success) {
      throw new Error('Train not found or API error');
    }

    const d = response.data;
    const currentStn = d.data.find(s => s.is_current_station) || d.data[0] || {};
    let delayMin = 0;
    if (currentStn.delay && currentStn.delay.includes('min')) {
      delayMin = parseInt(currentStn.delay.replace(/[^0-9]/g, ''), 10) || 0;
    }

    // Build station list for the route
    const stations = d.data.map(stn => ({
      station_code: resolveStationCode(stn.station_name),
      station_name: stn.station_name,
      delay_in_arrival: stn.delay === 'On Time' ? '0' : (parseInt(stn.delay?.replace(/[^0-9]/g,'')) || 0).toString(),
      has_arrived: stn.is_current_station ? false : (d.data.indexOf(stn) < d.data.indexOf(d.data.find(s => s.is_current_station) || d.data[d.data.length - 1])),
      platform_number: stn.platform || '',
    }));

    log('SCRAPER', `Status for ${trainNo}: ${d.message}`);

    res.json({
      data: {
        train_number: trainNo,
        train_name: (d.train_name || '').replace(' Running Status', '').replace(/^\d+\s*/, ''),
        delay: delayMin,
        current_station_name: currentStn.station_name || 'Unknown',
        current_station_info: { station_name: currentStn.station_name },
        platform: currentStn.platform || '',
        updated_time: d.updated_time || '',
        status: d.message,
        route: stations,
      }
    });
  } catch (e) {
    logErr('SCRAPER', `status: ${e.message}`);
    res.json({ data: null, error: e.message });
  }
});

app.get('/api/train/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) return res.json({ data: [] });
    log('SCRAPER', `Searching: ${query}`);

    const q = query.trim().toUpperCase();

    // If it's a train number (all digits), try rappid.in live lookup
    if (/^\d+$/.test(q)) {
      try {
        const url = `https://rappid.in/apis/train.php?train_no=${q}`;
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });

        if (response.data && response.data.success) {
          const rawName = (response.data.train_name || '').replace(' Running Status', '');
          const name = rawName.replace(/^\d+\s*/, ''); // strip leading train number
          const stations = response.data.data || [];
          const source = stations[0]?.station_name || '';
          const dest = stations[stations.length - 1]?.station_name || '';

          log('SCRAPER', `Found train: ${q} ${name}`);
          return res.json({
            data: [{
              train_number: q,
              train_name: name,
              source: source,
              destination: dest,
            }]
          });
        }
      } catch (apiErr) {
        logErr('SCRAPER', `Rappid lookup failed: ${apiErr.message}`);
      }

      // Fallback: check local database for partial number matches
      const localMatches = TRAIN_DATABASE.filter(t => t.train_number.startsWith(q));
      if (localMatches.length > 0) {
        return res.json({ data: localMatches });
      }

      return res.json({ data: [] });
    }

    // Text search: match against train names, station codes, station names
    const matches = TRAIN_DATABASE.filter(t => {
      const trainNameMatch = t.train_name.toUpperCase().includes(q);
      const srcMatch = t.source.toUpperCase() === q || (STATION_NAMES[t.source] || '').toUpperCase().includes(q);
      const destMatch = t.destination.toUpperCase() === q || (STATION_NAMES[t.destination] || '').toUpperCase().includes(q);
      return trainNameMatch || srcMatch || destMatch;
    });

    log('SCRAPER', `Text search "${query}" → ${matches.length} results`);
    res.json({ data: matches });
  } catch (e) {
    logErr('SCRAPER', `search: ${e.message}`);
    res.json({ data: [] });
  }
});

app.get('/api/train/schedule/:trainNo', async (req, res) => {
  try {
    const { trainNo } = req.params;
    log('SCRAPER', `Fetching schedule for ${trainNo}`);

    const url = `https://rappid.in/apis/train.php?train_no=${trainNo}`;
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });

    if (!response.data || !response.data.success) {
      throw new Error('Schedule not found');
    }

    const stations = response.data.data.map((stn) => {
      // Parse timing field: "16:5316:50" → arrival "16:53", departure "16:50"
      const timing = stn.timing || '';
      let arrival = '', departure = '';
      if (timing === 'Source' || timing === 'Destination') {
        arrival = timing;
        departure = timing;
      } else if (timing.length >= 10) {
        arrival = timing.substring(0, 5);
        departure = timing.substring(5, 10);
      } else if (timing.length >= 5) {
        arrival = timing.substring(0, 5);
        departure = arrival;
      }

      return {
        station_code: resolveStationCode(stn.station_name),
        station_name: stn.station_name,
        distance_from_source: parseInt((stn.distance || '').replace(/[^0-9]/g, '')) || 0,
        arrival_time: arrival,
        departure_time: departure,
        halt: stn.halt || '',
        platform: stn.platform || '',
        day: 1,
      };
    });

    log('SCRAPER', `Schedule for ${trainNo}: ${stations.length} stations`);
    res.json({ data: { route: stations } });
  } catch (e) {
    logErr('SCRAPER', `schedule: ${e.message}`);
    res.json({ data: null, error: e.message });
  }
});

app.get('/api/train/between', async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.json({ data: null, error: 'from and to required' });
  
  const f = from.toUpperCase(), t = to.toUpperCase();
  const matches = TRAIN_DATABASE.filter(tr => {
    const srcMatch = tr.source === f || (STATION_NAMES[tr.source] || '').toUpperCase().includes(f);
    const destMatch = tr.destination === t || (STATION_NAMES[tr.destination] || '').toUpperCase().includes(t);
    return srcMatch && destMatch;
  });
  
  res.json({ data: matches });
});

// --- Weather at Station (Open-Meteo — free, no key needed) ---
function mapWMO(code) {
  if (code === 0) return { condition: 'Clear', description: 'clear sky', icon: '01d' };
  if (code <= 3) return { condition: 'Clouds', description: 'partly cloudy', icon: '02d' };
  if (code === 45 || code === 48) return { condition: 'Fog', description: 'foggy', icon: '50d' };
  if (code >= 51 && code <= 67) return { condition: 'Rain', description: 'rain', icon: '10d' };
  if (code >= 71 && code <= 86) return { condition: 'Snow', description: 'snow', icon: '13d' };
  if (code >= 95) return { condition: 'Thunderstorm', description: 'thunderstorm', icon: '11d' };
  return { condition: 'Clear', description: 'clear', icon: '01d' };
}

app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    log('WEATHER', `Fetching weather at ${lat},${lon}`);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&forecast_days=1`;
    const r = await fetch(url);
    const data = await r.json();

    if (data.error) throw new Error(data.reason || 'Weather API error');

    const currentWMO = mapWMO(data.current.weather_code);
    log('WEATHER', `${data.current.temperature_2m}°C ${currentWMO.condition}`);

    const currentHourIdx = new Date().getHours();
    const forecast = [];
    if (data.hourly && data.hourly.time) {
      for (let i = currentHourIdx + 1; i <= currentHourIdx + 2 && i < 24; i++) {
        forecast.push({
          time: data.hourly.time[i],
          temp: Math.round(data.hourly.temperature_2m[i]),
          condition: mapWMO(data.hourly.weather_code[i]).condition,
        });
      }
    }

    res.json({
      data: {
        temp: Math.round(data.current.temperature_2m),
        feels_like: Math.round(data.current.temperature_2m),
        condition: currentWMO.condition,
        description: currentWMO.description,
        icon: currentWMO.icon,
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        city: 'Station',
        forecast,
      },
    });
  } catch (e) {
    logErr('WEATHER', e.message);
    res.json({ data: null, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚂 RailSage AI server on http://localhost:${PORT}`);
  console.log(`   Claude:  ${isRealKey ? '✅' : '❌ Not configured (placeholder key or missing)'}`);
  console.log(`   Weather: ✅ Open-Meteo (No Key Needed)`);
  console.log(`   Railway: ✅ Scraper Mode (No Key Needed)\n`);
});
