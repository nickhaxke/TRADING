export interface ForexPair {
  symbol: string;
  name: string;
  sessions: SessionType[];
}

export type SessionType = 'Tokyo' | 'London' | 'New York' | 'Sydney';

export interface Session {
  name: SessionType;
  timezone: string;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  color: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  selectedPairs: string[];
  alertsEnabled: boolean;
  timezone: string;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionStatus {
  session: Session;
  isOpen: boolean;
  timeUntilChange: number; // milliseconds
  activePairs: ForexPair[];
}

export const FOREX_PAIRS: ForexPair[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', sessions: ['London', 'New York'] },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', sessions: ['Sydney', 'New York'] },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', sessions: ['Tokyo', 'New York'] },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', sessions: ['London', 'New York'] },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', sessions: ['Sydney', 'Tokyo'] },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', sessions: ['Sydney', 'New York'] },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', sessions: ['London', 'New York'] },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', sessions: ['London', 'New York'] }
];

export const SESSIONS: Session[] = [
  {
    name: 'Tokyo',
    timezone: 'Asia/Tokyo',
    openTime: '09:00',
    closeTime: '18:00',
    color: '#ef4444'
  },
  {
    name: 'London',
    timezone: 'Europe/London',
    openTime: '08:00',
    closeTime: '17:00',
    color: '#3b82f6'
  },
  {
    name: 'New York',
    timezone: 'America/New_York',
    openTime: '08:00',
    closeTime: '17:00',
    color: '#10b981'
  },
  {
    name: 'Sydney',
    timezone: 'Australia/Sydney',
    openTime: '09:00',
    closeTime: '18:00',
    color: '#f59e0b'
  }
];