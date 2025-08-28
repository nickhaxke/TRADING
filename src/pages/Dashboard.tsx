import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForexSessions } from '../hooks/useForexSessions';
import { Clock, TrendingUp, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { sessionStatuses, formatTimeUntil, getCurrentTime } = useForexSessions();

  const openSessions = sessionStatuses.filter(status => status.isOpen);
  const closedSessions = sessionStatuses.filter(status => !status.isOpen);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Welcome back, {userProfile?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your forex sessions and stay ahead of the market
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {userProfile?.alertsEnabled && (
            <div className="flex items-center space-x-1 text-green-600 text-sm">
              <Bell className="h-4 w-4" />
              <span>Alerts On</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Selected Pairs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userProfile?.selectedPairs.length || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Sessions</p>
              <p className="text-2xl font-bold text-green-600">
                {openSessions.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed Sessions</p>
              <p className="text-2xl font-bold text-red-600">
                {closedSessions.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Timezone</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {userProfile?.timezone.split('/')[1] || 'UTC'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* No pairs selected message */}
      {!userProfile?.selectedPairs.length && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                Get Started
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Select your forex pairs to start tracking sessions and receive alerts.
              </p>
              <Link
                to="/pairs"
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Select Pairs
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions */}
      {sessionStatuses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Open Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Open Sessions ({openSessions.length})
            </h3>
            
            {openSessions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No sessions are currently open
              </p>
            ) : (
              <div className="space-y-4">
                {openSessions.map(({ session, timeUntilChange, activePairs }) => (
                  <div key={session.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: session.color }}
                        ></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {session.name}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getCurrentTime(session.timezone)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Closes in: <span className="font-mono">{formatTimeUntil(timeUntilChange)}</span>
                    </p>
                    
                    {activePairs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {activePairs.map(pair => (
                          <span
                            key={pair.symbol}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded"
                          >
                            {pair.symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Closed Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Closed Sessions ({closedSessions.length})
            </h3>
            
            {closedSessions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                All relevant sessions are open
              </p>
            ) : (
              <div className="space-y-4">
                {closedSessions.map(({ session, timeUntilChange, activePairs }) => (
                  <div key={session.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full opacity-50"
                          style={{ backgroundColor: session.color }}
                        ></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {session.name}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getCurrentTime(session.timezone)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Opens in: <span className="font-mono">{formatTimeUntil(timeUntilChange)}</span>
                    </p>
                    
                    {activePairs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {activePairs.map(pair => (
                          <span
                            key={pair.symbol}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                          >
                            {pair.symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};