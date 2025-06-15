
import {
  MissileLaunch, MissileStatus, Tweet, GovReportItem, ReportStatus, MediaItem,
  NamedCoordinates
} from '../types';
import {
  LOCATIONS, PAYLOAD_TYPES, TWEET_USERNAMES, TWEET_HASHTAGS,
  REPORT_TITLES_PREFIX, LOCATIONS_IRAN, LOCATIONS_ISRAEL,
  TWEET_EVENT_TYPES, TWEET_SPECIFIC_ACTIONS, TWEET_OBSERVATIONS,
  TWEET_RUMORS, TWEET_QUESTIONS, TWEET_SITUATIONS, TWEET_AREAS,
  TWEET_ADJECTIVES, TWEET_NOUN_PHRASES, SIMULATION_TICK_RATE_MS
} from '../constants';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = (): string => Math.random().toString(36).substring(2, 10);

export const generateMissileLaunch = (): MissileLaunch => {
  let origin: NamedCoordinates, destination: NamedCoordinates;
  
  const originIsIran = Math.random() < 0.5;
  if (originIsIran) {
    origin = getRandomElement(LOCATIONS_IRAN);
    destination = getRandomElement(LOCATIONS_ISRAEL);
  } else {
    origin = getRandomElement(LOCATIONS_ISRAEL);
    destination = getRandomElement(LOCATIONS_IRAN);
  }

  const eta = getRandomInt(15, 60); // ETA in seconds

  return {
    id: `msl-${generateId()}`,
    origin,
    destination,
    payload: getRandomElement(PAYLOAD_TYPES),
    etaSeconds: eta,
    status: MissileStatus.LAUNCH_DETECTED,
    launchTime: Date.now(),
  };
};

export const updateMissile = (missile: MissileLaunch): MissileLaunch => {
  const newEta = Math.max(0, missile.etaSeconds - (SIMULATION_TICK_RATE_MS / 1000)); 
  let newStatus = missile.status;

  if (missile.status === MissileStatus.LAUNCH_DETECTED && missile.etaSeconds > 0) {
     if (Math.random() < 0.9) { 
        newStatus = MissileStatus.EN_ROUTE;
     }
  } else if (newStatus === MissileStatus.EN_ROUTE && newEta <= 0) {
    newStatus = Math.random() > 0.3 ? MissileStatus.IMPACTED : MissileStatus.INTERCEPTED; // 30% chance of interception
  }
  
  const updatedMissile = { ...missile, etaSeconds: newEta, status: newStatus };
  if ((newStatus === MissileStatus.IMPACTED || newStatus === MissileStatus.INTERCEPTED) && !missile.impactTime) {
    updatedMissile.impactTime = Date.now();
  }
  return updatedMissile;
};

// --- Diversified Tweet Generation ---
const generateObservationalTweet = (location: NamedCoordinates): string => {
  return `Seeing ${getRandomElement(TWEET_ADJECTIVES)} ${getRandomElement(TWEET_OBSERVATIONS)} near ${location.name}. ${getRandomElement(TWEET_QUESTIONS)}`;
};

const generateEventTweet = (location: NamedCoordinates): string => {
  return `${getRandomElement(TWEET_ADJECTIVES).toUpperCase()} ${getRandomElement(TWEET_EVENT_TYPES)} reported in ${location.name}'s vicinity. ${getRandomElement(TWEET_SITUATIONS)}`;
};

const generateRumorTweet = (location: NamedCoordinates): string => {
  return `Unconfirmed chatter: ${getRandomElement(TWEET_RUMORS)} linked to events at ${location.name}. Is this credible?`;
};

const generateActionTweet = (location: NamedCoordinates): string => {
  const actor = Math.random() < 0.5 ? "IR" : "IDF"; // Simplified actor
  return `Sources claim ${actor} initiating ${getRandomElement(TWEET_SPECIFIC_ACTIONS)} around ${getRandomElement(TWEET_AREAS)} near ${location.name}.`;
};

const generateSituationTweet = (location: NamedCoordinates): string => {
  return `The situation in ${location.name} is evolving. ${getRandomElement(TWEET_NOUN_PHRASES)} observed. ${getRandomElement(TWEET_SITUATIONS)}`;
};

export const generateTweet = (): Tweet => {
  const numHashtags = getRandomInt(1, 3);
  const hashtags: string[] = [];
  for (let i = 0; i < numHashtags; i++) {
    hashtags.push(getRandomElement(TWEET_HASHTAGS));
  }
  
  const involvedLocation = getRandomElement(LOCATIONS); // Uses combined Iran/Israel locations

  const tweetGenerators = [
    generateObservationalTweet,
    generateEventTweet,
    generateRumorTweet,
    generateActionTweet,
    generateSituationTweet,
  ];
  const selectedGenerator = getRandomElement(tweetGenerators);
  const text = selectedGenerator(involvedLocation);

  return {
    id: `twt-${generateId()}`,
    username: getRandomElement(TWEET_USERNAMES),
    text: text,
    hashtags: Array.from(new Set(hashtags)), // Unique hashtags
    timestamp: Date.now(),
  };
};
// --- End Diversified Tweet Generation ---

export const generateGovReport = (): GovReportItem => {
  const dateSuffix = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const focalPoint = getRandomElement(LOCATIONS).name;
  return {
    id: `rep-${generateId()}`,
    title: `${getRandomElement(REPORT_TITLES_PREFIX)} - ${dateSuffix} #${getRandomInt(100,999)}`,
    content: `Intelligence confirms multiple engagements in the ${focalPoint} sector. ${getRandomElement(["Defensive systems fully operational.", "Offensive capabilities being assessed.", "Civilian alert levels raised.", "Full spectrum dominance asserted."])} Threat assessment indicates use of ${getRandomElement(PAYLOAD_TYPES)}. All units on high alert. Further updates pending.`,
    status: getRandomElement(Object.values(ReportStatus)),
    timestamp: Date.now(),
  };
};

export const generateMediaItem = (): MediaItem => {
  const seed = generateId(); // Unique seed for picsum
  const location = getRandomElement(LOCATIONS).name; // Uses combined Iran/Israel locations
  const now = new Date();
  return {
    id: `med-${generateId()}`,
    url: `https://picsum.photos/seed/${seed}/400/300?grayscale&blur=1`, // Placeholder image with effects
    type: 'image',
    location: location,
    time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}Z`,
    source: getRandomElement(["SAT-IMAGE", "BORDER-CAM", "UAV-DRONE", "LEAKED-INTEL", "SIGINT", "FIELD-REPORT-IMG"]),
    timestamp: now.getTime(),
  };
};