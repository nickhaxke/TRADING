import React, { useState, useEffect } from 'react';
import { Clock, Globe, TrendingUp, Bell, Settings, Sun, Moon } from 'lucide-react';

interface ForexSession {
  name: string;
  city: string;
  startHour: number; // GMT hour (0-23)
  endHour: number;   // GMT hour (0-23)
  color: string;
  isActive: boolean;
  timeUntilNext?: string;
}

interface CurrencyPair {
  symbol: string;
  name: string;
  sessions: {
    [key: string]: {
      volatility: 'Low' | 'Medium' | 'High';
      avgRange: number;
      description: string;
    };
  };
}

const CURRENCY_PAIRS: CurrencyPair[] = [
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    sessions: {
      Sydney: { volatility: 'Low', avgRange: 35, description: 'Quiet Asian session start' },
      Tokyo: { volatility: 'Medium', avgRange: 45, description: 'Asian market activity' },
      London: { volatility: 'High', avgRange: 85, description: 'Peak European activity' },
      NewYork: { volatility: 'High', avgRange: 90, description: 'US-EU overlap peak' },
    }
  },
  {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    sessions: {
      Sydney: { volatility: 'Low', avgRange: 40, description: 'Limited overnight activity' },
      Tokyo: { volatility: 'Medium', avgRange: 50, description: 'Moderate Asian interest' },
      London: { volatility: 'High', avgRange: 95, description: 'Home currency advantage' },
      NewYork: { volatility: 'High', avgRange: 100, description: 'Transatlantic trading' },
    }
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    sessions: {
      Sydney: { volatility: 'Medium', avgRange: 45, description: 'Pacific region activity' },
      Tokyo: { volatility: 'High', avgRange: 75, description: 'Home market dominance' },
      London: { volatility: 'Medium', avgRange: 60, description: 'European interest' },
      NewYork: { volatility: 'High', avgRange: 80, description: 'US market influence' },
    }
  },
  {
    symbol: 'USDCHF',
    name: 'US Dollar / Swiss Franc',
    sessions: {
      Sydney: { volatility: 'Low', avgRange: 30, description: 'Minimal overnight moves' },
      Tokyo: { volatility: 'Low', avgRange: 35, description: 'Limited Asian interest' },
      London: { volatility: 'High', avgRange: 70, description: 'European banking hours' },
      NewYork: { volatility: 'Medium', avgRange: 65, description: 'US trading session' },
    }
  },
  {
    symbol: 'USDCAD',
    name: 'US Dollar / Canadian Dollar',
    sessions: {
      Sydney: { volatility: 'Low', avgRange: 35, description: 'Quiet overnight period' },
      Tokyo: { volatility: 'Low', avgRange: 40, description: 'Limited Asian activity' },
      London: { volatility: 'Medium', avgRange: 55, description: 'European session' },
      NewYork: { volatility: 'High', avgRange: 75, description: 'North American focus' },
    }
  },
  {
    symbol: 'AUDUSD',
    name: 'Australian Dollar / US Dollar',
    sessions: {
      Sydney: { volatility: 'High', avgRange: 70, description: 'Home market advantage' },
      Tokyo: { volatility: 'Medium', avgRange: 55, description: 'Regional trading' },
      London: { volatility: 'Medium', avgRange: 60, description: 'European interest' },
      NewYork: { volatility: 'High', avgRange: 75, description: 'Commodity focus' },
    }
  },
  {
    symbol: 'NZDUSD',
    name: 'New Zealand Dollar / US Dollar',
    sessions: {
      Sydney: { volatility: 'High', avgRange: 65, description: 'Oceania trading' },
      Tokyo: { volatility: 'Medium', avgRange: 50, description: 'Asian session activity' },
      London: { volatility: 'Medium', avgRange: 55, description: 'European hours' },
      NewYork: { volatility: 'Medium', avgRange: 60, description: 'US commodity interest' },
    }
  },
  {
    symbol: 'EURJPY',
    name: 'Euro / Japanese Yen',
    sessions: {
      Sydney: { volatility: 'Low', avgRange: 40, description: 'Quiet cross-pair activity' },
      Tokyo: { volatility: 'High', avgRange: 80, description: 'JPY home advantage' },
      London: { volatility: 'High', avgRange: 90, description: 'EUR home advantage' },
      NewYork: { volatility: 'Medium', avgRange: 70, description: 'Cross-pair interest' },
    }
  },
  {
    symbol: 'GBPJPY',
    name: 'British Pound / Japanese Yen',
    sessions: {
      Sydney: { volatility: 'Medium', avgRange: 50, description: 'Volatile cross-pair' },
      Tokyo: { volatility: 'High', avgRange: 95, description: 'JPY market influence' },
      London: { volatility: 'High', avgRange: 110, description: 'GBP volatility peak' },
      NewYork: { volatility: 'High', avgRange: 100, description: 'Continued volatility' },
    }
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold / US Dollar',
    sessions: {
      Sydney: { volatility: 'Low', avgRange: 8, description: 'Quiet precious metals' },
      Tokyo: { volatility: 'Medium', avgRange: 12, description: 'Asian gold demand' },
      London: { volatility: 'High', avgRange: 18, description: 'London gold fixing' },
      NewYork: { volatility: 'High', avgRange: 20, description: 'US market influence' },
    }
  }
];

export const ForexSessions: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [sessions, setSessions] = useState<ForexSession[]>([]);

  // Initialize sessions
  useEffect(() => {
    const initSessions: ForexSession[] = [
      {
        name: 'Sydney',
        city: 'Sydney',
        startHour: 21, // 9 PM GMT (Sunday)
        endHour: 6,    // 6 AM GMT (Monday)
        color: 'bg-red-500',
        isActive: false
      },
      {
        name: 'Tokyo',
        city: 'Tokyo',
        startHour: 0,  // 12 AM GMT
        endHour: 9,    // 9 AM GMT
        color: 'bg-teal-500',
        isActive: false
      },
      {
        name: 'London',
        city: 'London',
        startHour: 8,  // 8 AM GMT
        endHour: 17,   // 5 PM GMT
        color: 'bg-blue-500',
        isActive: false
      },
      {
        name: 'NewYork',
        city: 'New York',
        startHour: 13, // 1 PM GMT
        endHour: 22,   // 10 PM GMT
        color: 'bg-green-500',
        isActive: false
      }
    ];
    setSessions(initSessions);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update session status
  useEffect(() => {
    const updateSessionStatus = () => {
      const gmtHour = currentTime.getUTCHours();
      
      setSessions(prevSessions => 
        prevSessions.map(session => {
          let isActive = false;
          
          if (session.startHour <= session.endHour) {
            // Same day session
            isActive = gmtHour >= session.startHour && gmtHour < session.endHour;
          } else {
            // Overnight session (like Sydney)
            isActive = gmtHour >= session.startHour || gmtHour < session.endHour;
          }

          // Calculate time until next session
          let timeUntilNext = '';
          if (!isActive) {
            let hoursUntil = 0;
            if (session.startHour <= session.endHour) {
              if (gmtHour < session.startHour) {
                hoursUntil = session.startHour - gmtHour;
              } else {
                hoursUntil = (24 - gmtHour) + session.startHour;
              }
            } else {
              if (gmtHour < session.startHour && gmtHour >= session.endHour) {
                hoursUntil = session.startHour - gmtHour;
              } else if (gmtHour >= session.endHour && gmtHour < session.startHour) {
                hoursUntil = session.startHour - gmtHour;
              } else {
                hoursUntil = (24 - gmtHour) + session.startHour;
              }
            }
            
            const hours = Math.floor(hoursUntil);
            const minutes = Math.floor((hoursUntil % 1) * 60);
            timeUntilNext = `${hours}h ${minutes}m`;
          }

          return {
            ...session,
            isActive,
            timeUntilNext
          };
        })
      );
    };

    updateSessionStatus();
  }, [currentTime]);

  // Get active sessions for overlap detection
  const activeSessions = sessions.filter(session => session.isActive);
  const hasOverlap = activeSessions.length > 1;

  // Get session times in local timezone
  const getLocalTime = (gmtHour: number) => {
    const date = new Date();
    date.setUTCHours(gmtHour, 0, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get selected pair data
  const selectedPairData = CURRENCY_PAIRS.find(pair => pair.symbol === selectedPair);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            Forex Session Tracker Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Track global forex sessions and market volatility
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              notificationsEnabled
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications {notificationsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Current Time Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Time</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Local Time</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">GMT Time</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString('en-GB', { timeZone: 'GMT' })}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                {currentTime.toLocaleDateString('en-GB', { timeZone: 'GMT' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Pair Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Currency Pair Analysis</h3>
          </div>
          
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="flex-1 sm:max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          >
            {CURRENCY_PAIRS.map(pair => (
              <option key={pair.symbol} value={pair.symbol}>
                {pair.symbol} - {pair.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sessions.map((session) => {
          const pairData = selectedPairData?.sessions[session.name];
          
          return (
            <div
              key={session.name}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border-l-4 transition-all duration-300 ${
                session.isActive
                  ? `${session.color.replace('bg-', 'border-')} ring-2 ring-blue-200 dark:ring-blue-800`
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {session.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{session.city}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${session.isActive ? session.color : 'bg-gray-300 dark:bg-gray-600'}`} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Opens:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getLocalTime(session.startHour)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Closes:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getLocalTime(session.endHour)}
                  </span>
                </div>
                
                {session.isActive ? (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <p className="text-green-800 dark:text-green-400 font-medium text-center">
                      🟢 ACTIVE NOW
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      Opens in: {session.timeUntilNext}
                    </p>
                  </div>
                )}

                {/* Pair-specific volatility data */}
                {pairData && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pairData.volatility === 'High' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : pairData.volatility === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {pairData.volatility}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Avg Range:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pairData.avgRange} pips
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {pairData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Overlaps Alert */}
      {hasOverlap && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                Session Overlap Active!
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                {activeSessions.map(s => s.name).join(' + ')} sessions are currently overlapping. 
                Expect higher volatility and trading volume.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          24-Hour Session Timeline
        </h3>
        
        <div className="relative">
          {/* Timeline bar */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
            {sessions.map((session) => {
              let startPercent, widthPercent;
              
              if (session.startHour <= session.endHour) {
                // Same day session
                startPercent = (session.startHour / 24) * 100;
                widthPercent = ((session.endHour - session.startHour) / 24) * 100;
              } else {
                // Overnight session - split into two parts
                const firstPartWidth = ((24 - session.startHour) / 24) * 100;
                const secondPartWidth = (session.endHour / 24) * 100;
                
                return (
                  <React.Fragment key={session.name}>
                    {/* First part (from start to midnight) */}
                    <div
                      className={`absolute top-0 h-full ${session.color} ${session.isActive ? 'opacity-100' : 'opacity-50'}`}
                      style={{
                        left: `${(session.startHour / 24) * 100}%`,
                        width: `${firstPartWidth}%`
                      }}
                    />
                    {/* Second part (from midnight to end) */}
                    <div
                      className={`absolute top-0 h-full ${session.color} ${session.isActive ? 'opacity-100' : 'opacity-50'}`}
                      style={{
                        left: '0%',
                        width: `${secondPartWidth}%`
                      }}
                    />
                  </React.Fragment>
                );
              }
              
              return (
                <div
                  key={session.name}
                  className={`absolute top-0 h-full ${session.color} ${session.isActive ? 'opacity-100' : 'opacity-50'}`}
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
              );
            })}
            
            {/* Current time indicator */}
            <div
              className="absolute top-0 w-0.5 h-full bg-red-600 z-10"
              style={{
                left: `${(currentTime.getUTCHours() / 24) * 100}%`
              }}
            />
          </div>
          
          {/* Time labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
          
          {/* Session legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {sessions.map((session) => (
              <div key={session.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${session.color}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{session.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          💡 Trading Tips for {selectedPair}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Best Trading Times:</h4>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              {selectedPairData && Object.entries(selectedPairData.sessions)
                .filter(([_, data]) => data.volatility === 'High')
                .map(([sessionName, _]) => (
                  <li key={sessionName}>• {sessionName} Session</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Session Overlaps:</h4>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• London + New York (1-5 PM GMT)</li>
              <li>• Sydney + Tokyo (12-6 AM GMT)</li>
              <li>• Tokyo + London (8-9 AM GMT)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};