import React from 'react';
import { ForexPair } from '../types/forex';
import { Check, TrendingUp } from 'lucide-react';

interface PairsTabProps {
  forexPairs: ForexPair[];
  selectedPairs: string[];
  onTogglePair: (pairId: string) => void;
}

export const PairsTab: React.FC<PairsTabProps> = ({
  forexPairs,
  selectedPairs,
  onTogglePair
}) => {
  const maxSelections = 10;
  const canSelectMore = selectedPairs.length < maxSelections;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-montserrat">
          Select Forex Pairs
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-opensans">
          Choose up to {maxSelections} pairs to track ({selectedPairs.length}/{maxSelections} selected)
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {forexPairs.map((pair) => {
            const isSelected = selectedPairs.includes(pair.id);
            const canSelect = canSelectMore || isSelected;
            
            return (
              <button
                key={pair.id}
                onClick={() => canSelect && onTogglePair(pair.id)}
                disabled={!canSelect}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : canSelect
                    ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-blue-100 dark:bg-blue-800' 
                      : 'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${
                      isSelected 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold font-montserrat ${
                      isSelected 
                        ? 'text-blue-900 dark:text-blue-100' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {pair.symbol}
                    </div>
                    <div className={`text-sm font-opensans ${
                      isSelected 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {pair.name}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="p-1 bg-blue-500 rounded-full">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {selectedPairs.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 font-montserrat">
            Selected Pairs ({selectedPairs.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedPairs.map((pairId) => {
              const pair = forexPairs.find(p => p.id === pairId);
              return (
                <span
                  key={pairId}
                  className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm font-medium font-opensans"
                >
                  {pair?.symbol}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};