import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Clock, Save, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [alertsEnabled, setAlertsEnabled] = useState(userProfile?.alertsEnabled || false);
  const [timezone, setTimezone] = useState(userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await updateUserProfile({
        alertsEnabled,
        timezone
      });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = 
    alertsEnabled !== userProfile?.alertsEnabled ||
    timezone !== userProfile?.timezone;

  const commonTimezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your preferences and notifications
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md flex items-center ${
          message.includes('Error') 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
        }`}>
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {message}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Notifications */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Push Alerts
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications 15 minutes before sessions open
                </p>
              </div>
              <button
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${alertsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${alertsEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
            
            {alertsEnabled && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Browser Permissions Required</p>
                    <p>
                      Make sure to allow notifications in your browser settings. 
                      You'll receive alerts 15 minutes before your selected forex pairs' sessions open.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timezone */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Timezone
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Your Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <optgroup label="Auto-detected">
                  <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto)
                  </option>
                </optgroup>
                <optgroup label="Common Timezones">
                  {commonTimezones.map(tz => (
                    <option key={tz} value={tz}>
                      {tz.replace('_', ' ')}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Current time in selected timezone: {' '}
                <span className="font-mono">
                  {new Date().toLocaleString('en-US', { 
                    timeZone: timezone,
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </button>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          About Notifications
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Alerts are sent 15 minutes before session opening times</li>
          <li>• Only sessions relevant to your selected pairs will trigger alerts</li>
          <li>• Notifications work even when the browser tab is not active</li>
          <li>• You can disable alerts anytime from this settings page</li>
        </ul>
      </div>
    </div>
  );
};