import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { CORRIDOR_TRAINS } from "./src/data/corridorTrains.js";
import { findTrainsBetween } from "./src/data/trainRoutes.js";

import {
  STATIONS,
  STATION_BY_CODE,
  searchStations,
  resolveStationCode,
} from "./src/data/stations.js";
import { SPECIAL_TRAINS } from "./src/data/specialTrains.js";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

function log(tag, msg) {
  console.log(`[${new Date().toISOString()}] [${tag}] ${msg}`);
}
function logErr(tag, msg) {
  console.error(`[${new Date().toISOString()}] [${tag}] ❌ ${msg}`);
}

// ── Claude AI ────────────────────────────────────────────
const apiKey = process.env.ANTHROPIC_API_KEY;
const isRealKey = apiKey && !apiKey.includes("add_later") && apiKey.length > 20;
const anthropic = isRealKey ? new Anthropic({ apiKey }) : null;

app.post("/api/chat", async (req, res) => {
  if (!anthropic) {
    return res.json({
      content:
        "AI chat isn't configured yet — add your ANTHROPIC_API_KEY to .env to enable it. Train tracking and live status work fine!",
    });
  }
  try {
    const { messages, systemPrompt, trainContext, language } = req.body;
    const langLabel =
      language === "hi"
        ? "Hindi (Devanagari)"
        : language === "ja"
          ? "Japanese"
          : "English";
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: `${systemPrompt}\n\nCURRENT DATA:\n${trainContext}\n\nRESPOND IN: ${langLabel}`,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    res.json({ content: response.content[0].text });
  } catch (e) {
    logErr("CHAT", e.message);
    res.json({ content: "Having trouble connecting to AI. Please try again." });
  }
});

// Parse delay string → minutes
// "14 min late" → 14, "On Time" → 0, "Source" → 0
function parseDelay(delayStr) {
  if (
    !delayStr ||
    delayStr === "On Time" ||
    delayStr === "Source" ||
    delayStr === "Destination" ||
    delayStr === "-"
  )
    return 0;
  const match = delayStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Parse timing string from rappid.in
// "16:5316:50" → { arrival: "16:53", departure: "16:50" }
// "Source" or "Destination" → both same
function parseTiming(timing) {
  if (!timing) return { arrival: "", departure: "" };
  if (timing === "Source") return { arrival: "Source", departure: timing };
  if (timing === "Destination")
    return { arrival: timing, departure: "Destination" };
  if (timing.length >= 10) {
    return {
      arrival: timing.substring(0, 5),
      departure: timing.substring(5, 10),
    };
  }
  if (timing.length >= 5) {
    return {
      arrival: timing.substring(0, 5),
      departure: timing.substring(0, 5),
    };
  }
  return { arrival: timing, departure: timing };
}

// ── Train database for text search ───────────────────────
// Core well-known trains + full special trains list merged in

const TRAIN_DATABASE = [
  {
    train_number: "12301",
    train_name: "Howrah Rajdhani Express",
    source: "HWH",
    destination: "NDLS",
  },
  {
    train_number: "12302",
    train_name: "New Delhi Rajdhani Express",
    source: "NDLS",
    destination: "HWH",
  },
  {
    train_number: "12951",
    train_name: "Mumbai Rajdhani Express",
    source: "BCT",
    destination: "NDLS",
  },
  {
    train_number: "12952",
    train_name: "New Delhi Rajdhani Express",
    source: "NDLS",
    destination: "BCT",
  },
  {
    train_number: "12309",
    train_name: "Rajdhani Express",
    source: "PNBE",
    destination: "NDLS",
  },
  {
    train_number: "12004",
    train_name: "Lucknow Shatabdi Express",
    source: "NDLS",
    destination: "LKO",
  },
  {
    train_number: "12003",
    train_name: "Lucknow Shatabdi Express",
    source: "LKO",
    destination: "NDLS",
  },
  {
    train_number: "12002",
    train_name: "Bhopal Shatabdi Express",
    source: "NDLS",
    destination: "BPL",
  },
  {
    train_number: "12001",
    train_name: "Bhopal Shatabdi Express",
    source: "BPL",
    destination: "NDLS",
  },
  {
    train_number: "12801",
    train_name: "Purushottam Express",
    source: "NDLS",
    destination: "PURI",
  },
  {
    train_number: "12621",
    train_name: "Tamil Nadu Express",
    source: "NDLS",
    destination: "MAS",
  },
  {
    train_number: "12622",
    train_name: "Tamil Nadu Express",
    source: "MAS",
    destination: "NDLS",
  },
  {
    train_number: "12269",
    train_name: "Duronto Express",
    source: "HWH",
    destination: "NZM",
  },
  {
    train_number: "12903",
    train_name: "Golden Temple Mail",
    source: "BCT",
    destination: "ASR",
  },
  {
    train_number: "12925",
    train_name: "Paschim Express",
    source: "BDTS",
    destination: "ASR",
  },
  {
    train_number: "12423",
    train_name: "Dibrugarh Rajdhani",
    source: "DBRG",
    destination: "NDLS",
  },
  {
    train_number: "22691",
    train_name: "Rajdhani Express",
    source: "SBC",
    destination: "NZM",
  },
  {
    train_number: "12259",
    train_name: "Sealdah Duronto Express",
    source: "SDAH",
    destination: "NDLS",
  },
  {
    train_number: "12627",
    train_name: "Karnataka Express",
    source: "NDLS",
    destination: "SBC",
  },
  {
    train_number: "12628",
    train_name: "Karnataka Express",
    source: "SBC",
    destination: "NDLS",
  },
  {
    train_number: "12723",
    train_name: "Telangana Express",
    source: "NDLS",
    destination: "SC",
  },
  {
    train_number: "12724",
    train_name: "Telangana Express",
    source: "SC",
    destination: "NDLS",
  },
  {
    train_number: "12313",
    train_name: "Sealdah Rajdhani",
    source: "SDAH",
    destination: "NDLS",
  },
  {
    train_number: "12314",
    train_name: "Sealdah Rajdhani",
    source: "NDLS",
    destination: "SDAH",
  },
  {
    train_number: "12431",
    train_name: "Trivandrum Rajdhani",
    source: "TVC",
    destination: "NZM",
  },
  {
    train_number: "12432",
    train_name: "Trivandrum Rajdhani",
    source: "NZM",
    destination: "TVC",
  },
  {
    train_number: "12625",
    train_name: "Kerala Express",
    source: "NDLS",
    destination: "TVC",
  },
  {
    train_number: "12626",
    train_name: "Kerala Express",
    source: "TVC",
    destination: "NDLS",
  },
  {
    train_number: "12559",
    train_name: "Shiv Ganga Express",
    source: "NDLS",
    destination: "BSB",
  },
  {
    train_number: "12560",
    train_name: "Shiv Ganga Express",
    source: "BSB",
    destination: "NDLS",
  },
  {
    train_number: "12915",
    train_name: "Ashram Express",
    source: "ADI",
    destination: "NDLS",
  },
  {
    train_number: "12916",
    train_name: "Ashram Express",
    source: "NDLS",
    destination: "ADI",
  },
  {
    train_number: "12953",
    train_name: "August Kranti Rajdhani",
    source: "BCT",
    destination: "NZM",
  },
  {
    train_number: "12954",
    train_name: "August Kranti Rajdhani",
    source: "NZM",
    destination: "BCT",
  },
  {
    train_number: "12049",
    train_name: "Gatimaan Express",
    source: "NDLS",
    destination: "JHS",
  },
  {
    train_number: "12050",
    train_name: "Gatimaan Express",
    source: "JHS",
    destination: "NDLS",
  },
  {
    train_number: "20501",
    train_name: "Vande Bharat Express",
    source: "NDLS",
    destination: "BSB",
  },
  {
    train_number: "20502",
    train_name: "Vande Bharat Express",
    source: "BSB",
    destination: "NDLS",
  },
  {
    train_number: "12039",
    train_name: "Shatabdi Express",
    source: "NDLS",
    destination: "AGC",
  },
  {
    train_number: "12040",
    train_name: "Shatabdi Express",
    source: "AGC",
    destination: "NDLS",
  },
  {
    train_number: "12138",
    train_name: "Punjab Mail",
    source: "CSMT",
    destination: "FZR",
  },
  {
    train_number: "12137",
    train_name: "Punjab Mail",
    source: "FZR",
    destination: "CSMT",
  },
  {
    train_number: "12229",
    train_name: "Lucknow Mail",
    source: "NDLS",
    destination: "LKO",
  },
  {
    train_number: "12230",
    train_name: "Lucknow Mail",
    source: "LKO",
    destination: "NDLS",
  },
  {
    train_number: "12305",
    train_name: "Howrah Rajdhani Express",
    source: "HWH",
    destination: "NDLS",
  },
  {
    train_number: "12306",
    train_name: "New Delhi Rajdhani Express",
    source: "NDLS",
    destination: "HWH",
  },
  {
    train_number: "12433",
    train_name: "Chennai Rajdhani",
    source: "MAS",
    destination: "NZM",
  },
  {
    train_number: "12434",
    train_name: "Chennai Rajdhani",
    source: "NZM",
    destination: "MAS",
  },
  {
    train_number: "12561",
    train_name: "Swatantrata S Superfast",
    source: "NDLS",
    destination: "BSB",
  },
  {
    train_number: "12155",
    train_name: "Shaan E Bhopal Express",
    source: "NDLS",
    destination: "BPL",
  },
  {
    train_number: "22436",
    train_name: "Vande Bharat Express",
    source: "NDLS",
    destination: "BSB",
  },
];

// Merge in the full special trains list extracted from the official PDF
TRAIN_DATABASE.push(...SPECIAL_TRAINS, ...CORRIDOR_TRAINS);

// De-duplicate by train_number (special trains list may overlap with core list)
const seenNumbers = new Set();
const DEDUPED_TRAIN_DATABASE = TRAIN_DATABASE.filter((t) => {
  if (seenNumbers.has(t.train_number)) return false;
  seenNumbers.add(t.train_number);
  return true;
});

log(
  "BOOT",
  `Train database loaded: ${DEDUPED_TRAIN_DATABASE.length} trains, ${STATIONS.length} stations`,
);

// ── /api/station/search ───────────────────────────────────
// Autocomplete for station names/codes — used by Journey page

app.get("/api/station/search", (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 1) return res.json({ data: [] });
  const results = searchStations(query, 8);
  log("STATION", `"${query}" → ${results.length} results`);
  res.json({ data: results });
});

// ── /api/train/search ─────────────────────────────────────

app.get("/api/train/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) return res.json({ data: [] });
    log("SEARCH", `Query: "${query}"`);

    const q = query.trim().toUpperCase();

    // Pure number — try live lookup first
    if (/^\d+$/.test(q)) {
      try {
        const url = `https://rappid.in/apis/train.php?train_no=${q}`;
        const r = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(5000),
        });
        const json = await r.json();

        if (json && json.success && json.data?.length) {
          const rawName = (json.train_name || "")
            .replace(" Running Status", "")
            .replace(/^\d+\s*/, "");
          const stations = json.data;
          const src = stations[0]?.station_name || "";
          const dest = stations[stations.length - 1]?.station_name || "";
          log("SEARCH", `Live hit: ${q} — ${rawName}`);
          return res.json({
            data: [
              {
                train_number: q,
                train_name: rawName,
                source: src,
                destination: dest,
              },
            ],
          });
        }
      } catch (e) {
        logErr("SEARCH", `Live lookup failed: ${e.message}`);
      }

      // Fallback to local DB
      const local = DEDUPED_TRAIN_DATABASE.filter((t) =>
        t.train_number.startsWith(q),
      );
      return res.json({ data: local });
    }

    // Text search against local DB — uses comprehensive station name lookup
    const ql = query.toLowerCase();
    const matches = DEDUPED_TRAIN_DATABASE.filter(
      (t) =>
        t.train_name.toLowerCase().includes(ql) ||
        t.source.toLowerCase().includes(ql) ||
        t.destination.toLowerCase().includes(ql) ||
        (STATION_BY_CODE[t.source] || "").toLowerCase().includes(ql) ||
        (STATION_BY_CODE[t.destination] || "").toLowerCase().includes(ql),
    );
    log("SEARCH", `Text "${query}" → ${matches.length} results`);
    res.json({ data: matches });
  } catch (e) {
    logErr("SEARCH", e.message);
    res.json({ data: [] });
  }
});

// ── /api/train/status/:trainNo ────────────────────────────

app.get("/api/train/status/:trainNo", async (req, res) => {
  try {
    const { trainNo } = req.params;
    log("STATUS", `Fetching ${trainNo}`);

    const url = `https://rappid.in/apis/train.php?train_no=${trainNo}`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    const json = await r.json();

    if (!json || !json.success || !json.data?.length) {
      throw new Error("Train not found or no data returned");
    }

    const stations = json.data;

    // Find current station — rappid.in marks it with is_current_station: true
    const currentIdx = stations.findIndex((s) => s.is_current_station === true);
    const currentStn = currentIdx >= 0 ? stations[currentIdx] : stations[0];

    // Parse delay from current station
    const delayMin = parseDelay(currentStn?.delay);

    // Clean train name
    const trainName = (json.train_name || "")
      .replace(" Running Status", "")
      .replace(/^\d+\s*/, "")
      .trim();

    // Build normalized station list — uses comprehensive resolveStationCode()
    const normalizedStations = stations.map((stn, idx) => {
      const { arrival, departure } = parseTiming(stn.timing);
      const hasPassed = currentIdx >= 0 ? idx < currentIdx : false;
      const isCurrent = idx === currentIdx;

      return {
        station_code: resolveStationCode(stn.station_name),
        station_name: stn.station_name || "",
        arrival_time: arrival,
        departure_time: departure,
        delay_in_arrival: parseDelay(stn.delay).toString(),
        has_arrived: hasPassed,
        is_current: isCurrent,
        platform_number: stn.platform || "",
        distance: stn.distance || "",
        halt: stn.halt || "",
        status: hasPassed ? "passed" : isCurrent ? "current" : "upcoming",
      };
    });

    log(
      "STATUS",
      `${trainNo} — delay: ${delayMin}m, current: ${currentStn?.station_name}`,
    );

    res.json({
      data: {
        train_number: trainNo,
        train_name: trainName,
        delay: delayMin,
        late_min: delayMin,
        current_station_name: currentStn?.station_name || "",
        current_station_info: {
          station_name: currentStn?.station_name || "",
          station_code: resolveStationCode(currentStn?.station_name || ""),
        },
        platform: currentStn?.platform || "",
        updated_time: json.updated_time || new Date().toISOString(),
        status_message: json.message || "",
        running_status: delayMin === 0 ? "on_time" : "delayed",
        route: normalizedStations,
      },
    });
  } catch (e) {
    logErr("STATUS", e.message);
    res.json({ data: null, error: e.message });
  }
});

// ── /api/train/schedule/:trainNo ─────────────────────────

app.get("/api/train/schedule/:trainNo", async (req, res) => {
  try {
    const { trainNo } = req.params;
    log("SCHEDULE", `Fetching ${trainNo}`);

    const url = `https://rappid.in/apis/train.php?train_no=${trainNo}`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    const json = await r.json();

    if (!json || !json.success || !json.data?.length) {
      throw new Error("Schedule not found");
    }

    const currentIdx = json.data.findIndex(
      (s) => s.is_current_station === true,
    );

    const stations = json.data.map((stn, idx) => {
      const { arrival, departure } = parseTiming(stn.timing);
      const hasPassed = currentIdx >= 0 ? idx < currentIdx : false;
      const isCurrent = idx === currentIdx;

      return {
        station_code: resolveStationCode(stn.station_name),
        station_name: stn.station_name || "",
        arrival_time: arrival,
        departure_time: departure,
        distance: parseInt((stn.distance || "").replace(/[^0-9]/g, "")) || 0,
        halt: stn.halt || "",
        platform: stn.platform || "",
        day: 1,
        status: hasPassed ? "passed" : isCurrent ? "current" : "upcoming",
      };
    });

    log("SCHEDULE", `${trainNo} — ${stations.length} stations`);
    res.json({ data: { route: stations } });
  } catch (e) {
    logErr("SCHEDULE", e.message);
    res.json({ data: null, error: e.message });
  }
});

// ── /api/train/between ────────────────────────────────────
// Now resolves city/station names to codes using the full station database
// so "Kanpur" → CNB, "Delhi" → NDLS, etc. work reliably

app.get("/api/train/between", async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to)
    return res.json({ data: [], error: "from and to required" });

  const fromCode = resolveStationCode(from);
  const toCode = resolveStationCode(to);

  // Primary: search the full-route database — finds trains that PASS THROUGH
  // both stations even if neither is the train's actual start/end point
  let matches = findTrainsBetween(fromCode, toCode);

  // Fallback: exact source/destination match from the flat train list
  // (covers special/corridor trains without full route data yet)
  if (matches.length === 0) {
    matches = DEDUPED_TRAIN_DATABASE.filter(
      (tr) => tr.source === fromCode && tr.destination === toCode,
    );
  }

  log(
    "BETWEEN",
    `${from}(${fromCode}) → ${to}(${toCode}): ${matches.length} trains`,
  );
  res.json({ data: matches });
});

// ── /api/weather ──────────────────────────────────────────

function mapWMO(code) {
  if (code === 0) return { condition: "Clear", icon: "01d" };
  if (code <= 3) return { condition: "Partly Cloudy", icon: "02d" };
  if (code === 45 || code === 48) return { condition: "Foggy", icon: "50d" };
  if (code >= 51 && code <= 67) return { condition: "Rainy", icon: "10d" };
  if (code >= 71 && code <= 86) return { condition: "Snowy", icon: "13d" };
  if (code >= 95) return { condition: "Thunderstorm", icon: "11d" };
  return { condition: "Clear", icon: "01d" };
}

app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon)
      return res.json({ data: null, error: "lat and lon required" });
    log("WEATHER", `${lat},${lon}`);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1`;
    const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await r.json();

    if (data.error) throw new Error(data.reason || "Weather API error");

    const wmo = mapWMO(data.current.weather_code);
    log("WEATHER", `${data.current.temperature_2m}°C ${wmo.condition}`);

    res.json({
      data: {
        temp: Math.round(data.current.temperature_2m),
        condition: wmo.condition,
        icon: wmo.icon,
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        city: "Station",
      },
    });
  } catch (e) {
    logErr("WEATHER", e.message);
    res.json({ data: null, error: e.message });
  }
});

// ── Start ─────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚂 RailSage AI server → http://localhost:${PORT}`);
  console.log(
    `   Claude AI : ${isRealKey ? "✅ Ready" : "⏳ Add ANTHROPIC_API_KEY later"}`,
  );
  console.log(`   Railway   : ✅ rappid.in (no key needed)`);
  console.log(`   Stations  : ✅ ${STATIONS.length} stations loaded`);
  console.log(
    `   Trains DB : ✅ ${DEDUPED_TRAIN_DATABASE.length} trains loaded`,
  );
  console.log(`   Weather   : ✅ Open-Meteo (no key needed)\n`);
});
