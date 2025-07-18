import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { useForexData } from '../hooks/useForexData';
import { Moon, Sun, Bell, BellOff, RotateCcw, Info } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { notificationsEnabled, toggleNotifications, requestPermission } = useNotifications();
  const { clearSelectedPairs, selectedPairs } = useForexData();

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        toggleNotifications();
      }
    } else {
      toggleNotifications();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-montserrat">
          App Settings
        </h2>
        
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDark ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white font-opensans">
                  Dark Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-opensans">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {notificationsEnabled ? (
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <BellOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white font-opensans">
                  Session Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-opensans">
                  Get notified 15 minutes before sessions open
                </p>
              </div>
            </div>
            <button
              onClick={handleNotificationToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Clear Selections */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white font-opensans">
                  Reset Pair Selection
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-opensans">
                  Clear all selected forex pairs ({selectedPairs.length} selected)
                </p>
              </div>
            </div>
            <button
              onClick={clearSelectedPairs}
              disabled={selectedPairs.length === 0}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium font-opensans hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 font-montserrat">
              About Trading Sessions
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1 font-opensans">
              <p><strong>Tokyo:</strong> 00:00 - 09:00 UTC</p>
              <p><strong>London:</strong> 07:00 - 16:00 UTC</p>
              <p><strong>New York:</strong> 12:00 - 21:00 UTC</p>
              <p><strong>Sydney:</strong> 21:00 - 06:00 UTC</p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Times are automatically adjusted to your local timezone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};