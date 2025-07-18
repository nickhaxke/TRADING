export interface ForexPair {
  id: string;
  symbol: string;
  name: string;
  sessions: string[]; // Array of session names where this pair is active
}

export interface TradingSession {
  name: string;
  utcStart: number; // Hour in UTC (0-23)
  utcEnd: number; // Hour in UTC (0-23)
  isActive: boolean;
  timeToNext: number; // Milliseconds until next open
  activePairs: string[]; // Symbols of active pairs during this session
  localStartTime: string; // Formatted local time
  localEndTime: string; // Formatted local time
}

export interface NotificationSettings {
  enabled: boolean;
  minutesBefore: number;
}