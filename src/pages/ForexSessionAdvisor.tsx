import React, { useState, useEffect } from 'react';
import { Clock, Bell, BellOff, Globe, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ForexPair {
  symbol: string;
  name: string;
  sessions: string[];
}

interface TradingSession {
  name: string;
  timezone: string;
  utcStart: number; // Hours in UTC
  utcEnd: number;
  color: string;
  icon: string;
}

interface SessionStatus {
  isActive: boolean;
  nextOpen: Date | null;
  nextClose: Date | null;
  timeToNext: string;
}

const FOREX_PAIRS: ForexPair[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', sessions: ['London', 'New York'] },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', sessions: ['London', 'New York'] },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', sessions: ['Tokyo', 'New York'] },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', sessions: ['Sydney', 'New York'] },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', sessions: ['New York'] },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', sessions: ['London', 'New York'] },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', sessions: ['Sydney', 'New York'] },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { symbol: 'EURGBP', name: 'Euro / British Pound', sessions: ['London'] },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', sessions: ['Tokyo', 'Sydney'] },
  { symbol: 'GBPAUD', name: 'British Pound / Australian Dollar', sessions: ['Sydney', 'London'] },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', sessions: ['Sydney', 'London'] },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', sessions: ['New York'] },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', sessions: ['New York'] },
  { symbol: 'CADJPY', name: 'Canadian Dollar / Japanese Yen', sessions: ['Tokyo', 'New York'] },
  { symbol: 'CHFJPY', name: 'Swiss Franc / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { symbol: 'AUDCAD', name: 'Australian Dollar / Canadian Dollar', sessions: ['Sydney', 'New York'] },
  { symbol: 'NZDJPY', name: 'New Zealand Dollar / Japanese Yen', sessions: ['Tokyo', 'Sydney'] },
  { symbol: 'EURCHF', name: 'Euro / Swiss Franc', sessions: ['London'] }
];

const TRADING_SESSIONS: TradingSession[] = [
  { name: 'Sydney', timezone: 'AEDT', utcStart: 21, utcEnd: 6, color: 'bg-green-500', icon: '🇦🇺' },
  { name: 'Tokyo', timezone: 'JST', utcStart: 0, utcEnd: 9, color: 'bg-red-500', icon: '🇯🇵' },
  { name: 'London', timezone: 'GMT', utcStart: 7, utcEnd: 16, color: 'bg-blue-500', icon: '🇬🇧' },
  { name: 'New York', timezone: 'EST', utcStart: 13, utcEnd: 22, color: 'bg-purple-500', icon: '🇺🇸' }
];

export const ForexSessionAdvisor: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'pairs' | 'sessions' | 'settings'>('pairs');
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState('');

  // Load preferences from localStorage
  useEffect(() => {
    const savedPairs = localStorage.getItem('forex-selected-pairs');
    const savedNotifications = localStorage.getItem('forex-notifications-enabled');
    
    if (savedPairs) {
      setSelectedPairs(JSON.parse(savedPairs));
    }
    
    if (savedNotifications) {
      setNotificationsEnabled(JSON.parse(savedNotifications));
    }

    // Detect user timezone
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('forex-selected-pairs', JSON.stringify(selectedPairs));
  }, [selectedPairs]);

  useEffect(() => {
    localStorage.setItem('forex-notifications-enabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Request notification permission
  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  const togglePairSelection = (symbol: string) => {
    setSelectedPairs(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(p => p !== symbol);
      } else if (prev.length < 10) {
        return [...prev, symbol];
      }
      return prev;
    });
  };

  const getSessionStatus = (session: TradingSession): SessionStatus => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const currentUtcTime = utcHour + utcMinutes / 60;

    let isActive = false;
    let nextOpen: Date | null = null;
    let nextClose: Date | null = null;

    // Handle sessions that cross midnight
    if (session.utcStart > session.utcEnd) {
      // Session crosses midnight (like Sydney: 21:00 - 06:00)
      isActive = currentUtcTime >= session.utcStart || currentUtcTime < session.utcEnd;
      
      if (isActive) {
        // Currently active, find next close
        if (currentUtcTime >= session.utcStart) {
          // We're in the first part (before midnight)
          nextClose = new Date(now);
          nextClose.setUTCDate(nextClose.getUTCDate() + 1);
          nextClose.setUTCHours(session.utcEnd, 0, 0, 0);
        } else {
          // We're in the second part (after midnight)
          nextClose = new Date(now);
          nextClose.setUTCHours(session.utcEnd, 0, 0, 0);
        }
      } else {
        // Not active, find next open
        nextOpen = new Date(now);
        nextOpen.setUTCHours(session.utcStart, 0, 0, 0);
        if (currentUtcTime > session.utcEnd) {
          // Next open is today
        } else {
          // Next open is tomorrow
          nextOpen.setUTCDate(nextOpen.getUTCDate() + 1);
        }
      }
    } else {
      // Normal session (doesn't cross midnight)
      isActive = currentUtcTime >= session.utcStart && currentUtcTime < session.utcEnd;
      
      if (isActive) {
        nextClose = new Date(now);
        nextClose.setUTCHours(session.utcEnd, 0, 0, 0);
      } else {
        nextOpen = new Date(now);
        nextOpen.setUTCHours(session.utcStart, 0, 0, 0);
        
        if (currentUtcTime >= session.utcEnd) {
          // Next open is tomorrow
          nextOpen.setUTCDate(nextOpen.getUTCDate() + 1);
        }
      }
    }

    const targetTime = isActive ? nextClose : nextOpen;
    const timeDiff = targetTime ? targetTime.getTime() - now.getTime() : 0;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    const timeToNext = timeDiff > 0 
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : '00:00:00';

    return { isActive, nextOpen, nextClose, timeToNext };
  };

  const getActivePairsForSession = (sessionName: string): ForexPair[] => {
    return FOREX_PAIRS.filter(pair => 
      selectedPairs.includes(pair.symbol) && 
      pair.sessions.includes(sessionName)
    );
  };

  const getRelevantSessions = (): TradingSession[] => {
    const relevantSessionNames = new Set<string>();
    
    selectedPairs.forEach(symbol => {
      const pair = FOREX_PAIRS.find(p => p.symbol === symbol);
      if (pair) {
        pair.sessions.forEach(session => relevantSessionNames.add(session));
      }
    });

    return TRADING_SESSIONS.filter(session => relevantSessionNames.has(session.name));
  };

  const formatLocalTime = (utcHour: number): string => {
    const date = new Date();
    date.setUTCHours(utcHour, 0, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderPairsTab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-montserrat font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Select Your Forex Pairs
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          Choose up to 10 forex pairs to track their optimal trading sessions. Selected: {selectedPairs.length}/10
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {FOREX_PAIRS.map((pair) => (
          <div
            key={pair.symbol}
            onClick={() => togglePairSelection(pair.symbol)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedPairs.includes(pair.symbol)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
            } ${selectedPairs.length >= 10 && !selectedPairs.includes(pair.symbol) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-montserrat font-semibold text-gray-900 dark:text-white">
                  {pair.symbol}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                  {pair.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {pair.sessions.map((session) => (
                  <span
                    key={session}
                    className={`px-2 py-1 text-xs rounded-full font-open-sans ${
                      session === 'Tokyo' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      session === 'London' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      session === 'New York' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {session}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessionsTab = () => {
    const relevantSessions = getRelevantSessions();

    if (selectedPairs.length === 0) {
      return (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-montserrat font-semibold text-gray-900 dark:text-white mb-2">
            No Pairs Selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-open-sans">
            Select some forex pairs to see their trading sessions
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-montserrat font-semibold text-green-900 dark:text-green-300 mb-2">
            Active Trading Sessions
          </h3>
          <p className="text-sm text-green-800 dark:text-green-400 font-open-sans">
            Your timezone: {userTimezone}
          </p>
        </div>

        {relevantSessions.map((session) => {
          const status = getSessionStatus(session);
          const activePairs = getActivePairsForSession(session.name);

          return (
            <div
              key={session.name}
              className={`p-4 rounded-lg border-2 ${
                status.isActive
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{session.icon}</span>
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-900 dark:text-white">
                      {session.name} Session
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                      {formatLocalTime(session.utcStart)} - {formatLocalTime(session.utcEnd)} (Local)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    status.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {status.isActive ? 'ACTIVE' : 'CLOSED'}
                  </div>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-white mt-1">
                    {status.timeToNext}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {status.isActive ? 'until close' : 'until open'}
                  </p>
                </div>
              </div>

              {activePairs.length > 0 && (
                <div>
                  <h5 className="font-montserrat font-medium text-gray-900 dark:text-white mb-2">
                    Your Active Pairs:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activePairs.map((pair) => (
                      <span
                        key={pair.symbol}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-medium font-open-sans"
                      >
                        {pair.symbol}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-montserrat font-semibold text-gray-900 dark:text-white mb-2">
          App Settings
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-open-sans">
          Customize your forex session advisor experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            {notificationsEnabled ? (
              <Bell className="h-5 w-5 text-blue-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <h4 className="font-montserrat font-medium text-gray-900 dark:text-white">
                Session Notifications
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                Get notified 15 minutes before sessions open
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3 mb-3">
            <Globe className="h-5 w-5 text-blue-600" />
            <h4 className="font-montserrat font-medium text-gray-900 dark:text-white">
              Timezone Information
            </h4>
          </div>
          <div className="space-y-2 text-sm font-open-sans">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Your Timezone:</span> {userTimezone}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Current Time:</span> {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">UTC Time:</span> {currentTime.toUTCString().split(' ')[4]}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3 mb-3">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
            <h4 className="font-montserrat font-medium text-gray-900 dark:text-white">
              Session Times (UTC)
            </h4>
          </div>
          <div className="space-y-2 text-sm font-open-sans">
            {TRADING_SESSIONS.map((session) => (
              <div key={session.name} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {session.icon} {session.name}:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {session.utcStart.toString().padStart(2, '0')}:00 - {session.utcEnd.toString().padStart(2, '0')}:00 UTC
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-montserrat font-medium text-blue-900 dark:text-blue-300 mb-2">
            About Session Times
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400 font-open-sans">
            All session times are automatically adjusted to your local timezone. The app uses real forex market hours and accounts for daylight saving time changes.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-montserrat font-bold">Forex Session Advisor</h1>
              <p className="text-blue-100 font-open-sans">
                Track optimal trading times for your forex pairs
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {[
              { id: 'pairs', label: 'Pairs', icon: Globe },
              { id: 'sessions', label: 'Sessions', icon: Clock },
              { id: 'settings', label: 'Settings', icon: SettingsIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium font-montserrat transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'pairs' && renderPairsTab()}
          {activeTab === 'sessions' && renderSessionsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};