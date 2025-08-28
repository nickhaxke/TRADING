import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FOREX_PAIRS } from '../types/forex';
import { TrendingUp, Check, X, Save } from 'lucide-react';

export const Pairs: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [selectedPairs, setSelectedPairs] = useState<string[]>(userProfile?.selectedPairs || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handlePairToggle = (symbol: string) => {
    if (selectedPairs.includes(symbol)) {
      setSelectedPairs(selectedPairs.filter(p => p !== symbol));
    } else if (selectedPairs.length < 10) {
      setSelectedPairs([...selectedPairs, symbol]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await updateUserProfile({ selectedPairs });
      setMessage('Pairs saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving pairs. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(selectedPairs.sort()) !== JSON.stringify((userProfile?.selectedPairs || []).sort());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Select Forex Pairs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Choose up to 10 forex pairs to track ({selectedPairs.length}/10)
          </p>
        </div>
        
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
        }`}>
          {message}
        </div>
      )}

      {/* Pairs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FOREX_PAIRS.map((pair) => {
          const isSelected = selectedPairs.includes(pair.symbol);
          const canSelect = selectedPairs.length < 10 || isSelected;
          
          return (
            <div
              key={pair.symbol}
              className={`
                relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : canSelect
                    ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed'
                }
              `}
              onClick={() => canSelect && handlePairToggle(pair.symbol)}
            >
              {/* Selection indicator */}
              <div className="absolute top-2 right-2">
                {isSelected ? (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : canSelect ? (
                  <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                ) : (
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <X className="h-4 w-4 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Pair info */}
              <div className="pr-8">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {pair.symbol}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {pair.name}
                </p>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Active Sessions:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {pair.sessions.map(session => (
                      <span
                        key={session}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {session}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected pairs summary */}
      {selectedPairs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selected Pairs ({selectedPairs.length})
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {selectedPairs.map(symbol => {
              const pair = FOREX_PAIRS.find(p => p.symbol === symbol);
              return (
                <div
                  key={symbol}
                  className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-md"
                >
                  <span className="font-medium">{symbol}</span>
                  <button
                    onClick={() => handlePairToggle(symbol)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
          
          {hasChanges && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                Save Selected Pairs
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};