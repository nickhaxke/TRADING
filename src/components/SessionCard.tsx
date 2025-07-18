import React from 'react';
import { TradingSession } from '../types/forex';
import { Clock, Globe, TrendingUp } from 'lucide-react';

interface SessionCardProps {
  session: TradingSession;
  currentTime: Date;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, currentTime }) => {
  const formatCountdown = (milliseconds: number): string => {
    if (milliseconds <= 0) return '00:00:00';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Tokyo': '🗾',
      'London': '🇬🇧',
      'New York': '🗽',
      'Sydney': '🇦🇺'
    };
    return icons[name] || '🌍';
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm border-l-4 ${
      session.isActive
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getSessionIcon(session.name)}</div>
          <div>
            <h3 className={`font-semibold font-montserrat ${
              session.isActive 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {session.name} Session
            </h3>
            <p className={`text-sm font-opensans ${
              session.isActive 
                ? 'text-green-600 dark:text-green-300' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {session.localStartTime} - {session.localEndTime}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium font-opensans ${
          session.isActive
            ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
          {session.isActive ? 'ACTIVE' : 'CLOSED'}
        </div>
      </div>

      {!session.isActive && (
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400 font-opensans">
            Opens in: <span className="font-mono font-semibold">{formatCountdown(session.timeToNext)}</span>
          </span>
        </div>
      )}

      {session.activePairs.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-opensans">
              Active Pairs ({session.activePairs.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {session.activePairs.map((pair) => (
              <span
                key={pair}
                className={`px-2 py-1 rounded text-xs font-medium font-opensans ${
                  session.isActive
                    ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {pair}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};