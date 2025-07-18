import React, { useState, useEffect } from 'react';
import { SessionCard } from './SessionCard';
import { useSessionData } from '../hooks/useSessionData';
import { Clock, AlertCircle } from 'lucide-react';

interface SessionsTabProps {
  selectedPairs: string[];
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ selectedPairs }) => {
  const { sessions, currentTime, userTimezone } = useSessionData(selectedPairs);
  const [, forceUpdate] = useState({});

  // Force re-render every second to update timers
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (selectedPairs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-montserrat">
          No Pairs Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-400 font-opensans">
          Please select some forex pairs from the Pairs tab to see relevant trading sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat">
            Trading Sessions
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 font-opensans">
            <Clock className="h-4 w-4" />
            <span>{userTimezone}</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-montserrat">
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-opensans">
            {currentTime.toLocaleDateString([], { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.name}
            session={session}
            currentTime={currentTime}
          />
        ))}
      </div>
    </div>
  );
};