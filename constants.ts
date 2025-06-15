
import { NamedCoordinates, ReportStatus } from './types';

// MAPBOX_ACCESS_TOKEN is no longer needed as the application now uses Leaflet.
// export const MAPBOX_ACCESS_TOKEN = 'YOUR_ACTUAL_MAPBOX_ACCESS_TOKEN_GOES_HERE';

export const SIMULATION_TICK_RATE_MS = 500; // General update tick (0.5s)
export const MISSILE_EVENT_INTERVAL_MS = 1500; // New missile launch/update (1.5s)
export const TWEET_INTERVAL_MS = 1200; // New tweet (1.2s)
export const REPORT_INTERVAL_MS = 25000; // New report (25s)
export const MEDIA_INTERVAL_MS = 5000; // New media item (5s) - Increased frequency

export const LOCATIONS_ISRAEL: NamedCoordinates[] = [
  { name: "Tel Aviv Central Command", lng: 34.7818, lat: 32.0853 },
  { name: "Jerusalem District HQ", lng: 35.2137, lat: 31.7683 },
  { name: "Haifa Naval Base", lng: 34.9896, lat: 32.7940 },
  { name: "Negev Research Complex", lng: 35.1118, lat: 31.0710 }, // Fictionalized Dimona area
  { name: "Eilat Port Authority", lng: 34.9530, lat: 29.5577 },
  { name: "Golan Heights Outpost", lng: 35.7500, lat: 33.0000 },
];

export const LOCATIONS_IRAN: NamedCoordinates[] = [
  { name: "Tehran Command Citadel", lng: 51.3890, lat: 35.6892 },
  { name: "Isfahan Aerospace Facility", lng: 51.6670, lat: 32.6546 },
  { name: "Bushehr Coastal Point", lng: 50.8353, lat: 28.9725 },
  { name: "Kavir Enrichment Site", lng: 51.7278, lat: 33.7250 }, // Fictionalized Natanz area
  { name: "Bandar Abbas Naval HQ", lng: 56.2808, lat: 27.1865 },
  { name: "Kermanshah Border Post", lng: 47.0650, lat: 34.3142 },
];

export const LOCATIONS: NamedCoordinates[] = [...LOCATIONS_ISRAEL, ...LOCATIONS_IRAN];

export const PAYLOAD_TYPES: string[] = [
  "Ballistic Warhead", "EMP Pulse Device", "Bunker Buster Unit", "Cybernetic Agent",
  "Area Denial Munition", "Recon Drone Swarm", "Precision Strike Package", "Jamming Array",
  "Hypersonic Glide Vehicle", "Intel Packet Interceptor"
];

export const TWEET_USERNAMES: string[] = [
  "Growing Daniel",
  "Blair Waldorfyan",
  "Vittorio",
  "severeengineer",
  "bronzeageshawty",
  "Greg Coppola",
  "SMA",
  "retardedwhore",
  "fintwt Mikael",
  "radfemhitler",
  "Gregory (6’3)",
  "Miles (formerly Pariah the Doll)",
  "Micci",
  "Race Science Will"
];

export const TWEET_HASHTAGS: string[] = [
  "#MidEastCrisis", "#IranIsraelTensions", "#RegionalConflict", "#RedAlert",
  "#IronShield", "#DesertStormAlpha", "#CyberWarfareME", "#GeopoliticsNow",
  "#BreakingIntel", "#Flashpoint", "#WarAlert"
];

export const REPORT_TITLES_PREFIX: string[] = [
  "CENTCOM Briefing", "Mossad Intel Update", "IRGC SitRep",
  "Regional Security Council Advisory", "ME Desk Analysis", "Emergency Broadcast",
  "DEFCON Status Report", "Cyber Command Alert"
];

export const REPORT_STATUS_MAP: Record<ReportStatus, string> = {
  [ReportStatus.NOMINAL]: "text-lime-400", // Brighter Green
  [ReportStatus.ELEVATED]: "text-orange-400", // Orange
  [ReportStatus.CRITICAL]: "text-red-400", // Brighter Red
  [ReportStatus.UNKNOWN]: "text-gray-400",
};

// New constants for diversified tweet generation
export const TWEET_EVENT_TYPES: string[] = ["explosions", "artillery fire", "drone activity", "fighter jet patrols", "troop movements", "cyberattacks", "signal jamming", "missile defense activation", "ground skirmishes"];
export const TWEET_SPECIFIC_ACTIONS: string[] = ["retaliatory strikes", "a border incursion", "a special operation", "a precision strike", "asset mobilization", "a defensive maneuver", "an intel sweep", "establishing a no-fly zone"];
export const TWEET_OBSERVATIONS: string[] = ["unusual troop formations", "heavy smoke plumes", "disrupted communications", "increased air traffic", "GPS spoofing", "fortification construction", "convoy movements", "naval patrols"];
export const TWEET_RUMORS: string[] = ["a high-value target was hit", "negotiations have broken down", "a third party is intervening", "new advanced weaponry deployed", "an ultimatum has been issued", "a ceasefire is being discussed", "foreign assets are repositioning"];
export const TWEET_QUESTIONS: string[] = ["Anyone confirm this?", "What's the source?", "Is this verified?", "Impact on civilians?", "Official statement soon?", "Any visual confirmation?", "What are the implications?"];
export const TWEET_SITUATIONS: string[] = ["Major escalation imminent.", "Things are heating up rapidly.", "Holding our breath here.", "Information lockdown in effect.", "Uncertainty reigns across the region.", "Tensions at breaking point.", "Monitoring closely."];
export const TWEET_AREAS: string[] = ["the northern sector", "the southern border", "coastal regions", "urban centers", "the desert outskirts", "key infrastructure nodes", "disputed territories", "airspace violations reported near"];
export const TWEET_ADJECTIVES: string[] = ["heavy", "intense", "sporadic", "confirmed", "unconfirmed", "significant", "minor", "escalating"];
export const TWEET_NOUN_PHRASES: string[] = ["military buildup", "civilian displacement", "emergency services response", "propaganda surge", "diplomatic fallout", "economic sanctions"];
