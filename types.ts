
export interface GeoCoordinates {
  lng: number;
  lat: number;
}

export interface NamedCoordinates extends GeoCoordinates {
  name: string;
}

export enum MissileStatus {
  EN_ROUTE = "EN ROUTE",
  INTERCEPTED = "INTERCEPTED",
  IMPACTED = "IMPACTED",
  LAUNCH_DETECTED = "LAUNCH DETECTED",
}

export interface MissileLaunch {
  id: string;
  origin: NamedCoordinates;
  destination: NamedCoordinates;
  payload: string;
  etaSeconds: number;
  status: MissileStatus;
  launchTime: number; // timestamp
  impactTime?: number; // timestamp
}

export interface Tweet {
  id: string;
  username: string;
  text: string;
  hashtags: string[];
  timestamp: number;
}

export enum ReportStatus {
  NOMINAL = "NOMINAL",
  ELEVATED = "ELEVATED",
  CRITICAL = "CRITICAL",
  UNKNOWN = "UNKNOWN",
}

export interface GovReportItem {
  id: string;
  title: string;
  content: string;
  status: ReportStatus;
  timestamp: number;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video'; // For now, only images
  location: string;
  time: string;
  source: string;
  timestamp: number;
}

export type ViewMode = "dashboard" | "map_only" | "terminal_only";
    