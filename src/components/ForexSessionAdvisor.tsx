import React, { useState, useEffect } from 'react';
import { PairsTab } from './PairsTab';
import { SessionsTab } from './SessionsTab';
import { SettingsTab } from './SettingsTab';
import { useForexData } from '../hooks/useForexData';
import { useNotifications } from '../hooks/useNotifications';
import { TrendingUp, Clock, Settings, Bell } from 'lucide-react';

export const ForexSessionAdvisor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pairs' | 'sessions' | 'settings'>('pairs');
  const { selectedPairs, togglePair, forexPairs } = useForexData();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const tabs = [
    { id: 'pairs' as const, label: 'Pairs', icon: TrendingUp },
    { id: 'sessions' as const, label: 'Sessions', icon: Clock },
    { id: 'settings' as const, label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white font-montserrat">
                  Forex Session Advisor
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-opensans">
                  Track trading sessions for your pairs
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleNotifications}
                className={`p-2 rounded-lg transition-colors ${
                  notificationsEnabled
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
                title={notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-opensans">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4">
        {activeTab === 'pairs' && (
          <PairsTab
            forexPairs={forexPairs}
            selectedPairs={selectedPairs}
            onTogglePair={togglePair}
          />
        )}
        {activeTab === 'sessions' && (
          <SessionsTab selectedPairs={selectedPairs} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
};