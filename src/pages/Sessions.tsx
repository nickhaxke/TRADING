import React from 'react';
import { useForexSessions } from '../hooks/useForexSessions';
import { useAuth } from '../contexts/AuthContext';
import { Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Sessions: React.FC = () => {
  const { userProfile } = useAuth();
  const { sessionStatuses, formatTimeUntil, getCurrentTime } = useForexSessions();

  if (!userProfile?.selectedPairs.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Trading Sessions
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            No Pairs Selected
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Select your forex pairs to see relevant trading sessions and live clocks.
          </p>
          <Link
            to="/pairs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Select Pairs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Trading Sessions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Live session clocks and countdowns for your selected pairs
        </p>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessionStatuses.map(({ session, isOpen, timeUntilChange, activePairs }) => (
          <div
            key={session.name}
            className={`
              bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 transition-all duration-300
              ${isOpen ? 'border-green-500' : 'border-red-500'}
            `}
          >
            {/* Session Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-4 h-4 rounded-full ${isOpen ? 'animate-pulse' : 'opacity-50'}`}
                  style={{ backgroundColor: session.color }}
                ></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {session.name}
                </h3>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full
                  ${isOpen 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  }
                `}>
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
            </div>

            {/* Live Clock */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Time</p>
                  <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    {getCurrentTime(session.timezone)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Session Times */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Opens</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {session.openTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Closes</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {session.closeTime}
                </p>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {isOpen ? 'Closes in' : 'Opens in'}
              </p>
              <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTimeUntil(timeUntilChange)}
              </p>
            </div>

            {/* Active Pairs */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Your Active Pairs ({activePairs.length})
              </p>
              {activePairs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activePairs.map(pair => (
                    <span
                      key={pair.symbol}
                      className={`
                        px-3 py-1 text-sm font-medium rounded-md
                        ${isOpen
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      {pair.symbol}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No pairs active in this session
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Session Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Session Overview
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {sessionStatuses.filter(s => s.isOpen).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Open Sessions</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {sessionStatuses.filter(s => !s.isOpen).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Closed Sessions</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {userProfile.selectedPairs.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Selected Pairs</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {sessionStatuses.reduce((total, s) => total + s.activePairs.length, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Pairs</p>
          </div>
        </div>
      </div>
    </div>
  );
};