import { useState, useEffect } from 'react';
import { ForexPair } from '../types/forex';

const FOREX_PAIRS: ForexPair[] = [
  { id: 'eurusd', symbol: 'EURUSD', name: 'Euro / US Dollar', sessions: ['London', 'New York'] },
  { id: 'gbpusd', symbol: 'GBPUSD', name: 'British Pound / US Dollar', sessions: ['London', 'New York'] },
  { id: 'usdjpy', symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', sessions: ['Tokyo', 'New York'] },
  { id: 'usdchf', symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', sessions: ['London', 'New York'] },
  { id: 'audusd', symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', sessions: ['Sydney', 'New York'] },
  { id: 'usdcad', symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', sessions: ['New York'] },
  { id: 'nzdusd', symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', sessions: ['Sydney', 'New York'] },
  { id: 'eurjpy', symbol: 'EURJPY', name: 'Euro / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { id: 'gbpjpy', symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { id: 'eurgbp', symbol: 'EURGBP', name: 'Euro / British Pound', sessions: ['London'] },
  { id: 'audjpy', symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', sessions: ['Tokyo', 'Sydney'] },
  { id: 'euraud', symbol: 'EURAUD', name: 'Euro / Australian Dollar', sessions: ['London', 'Sydney'] },
  { id: 'chfjpy', symbol: 'CHFJPY', name: 'Swiss Franc / Japanese Yen', sessions: ['Tokyo', 'London'] },
  { id: 'gbpaud', symbol: 'GBPAUD', name: 'British Pound / Australian Dollar', sessions: ['London', 'Sydney'] },
  { id: 'gbpchf', symbol: 'GBPCHF', name: 'British Pound / Swiss Franc', sessions: ['London'] },
  { id: 'audcad', symbol: 'AUDCAD', name: 'Australian Dollar / Canadian Dollar', sessions: ['Sydney', 'New York'] },
  { id: 'audchf', symbol: 'AUDCHF', name: 'Australian Dollar / Swiss Franc', sessions: ['Sydney', 'London'] },
  { id: 'audnzd', symbol: 'AUDNZD', name: 'Australian Dollar / New Zealand Dollar', sessions: ['Sydney'] },
  { id: 'cadchf', symbol: 'CADCHF', name: 'Canadian Dollar / Swiss Franc', sessions: ['New York', 'London'] },
  { id: 'cadjpy', symbol: 'CADJPY', name: 'Canadian Dollar / Japanese Yen', sessions: ['Tokyo', 'New York'] },
  { id: 'eurchf', symbol: 'EURCHF', name: 'Euro / Swiss Franc', sessions: ['London'] },
  { id: 'eurnzd', symbol: 'EURNZD', name: 'Euro / New Zealand Dollar', sessions: ['London', 'Sydney'] },
  { id: 'gbpcad', symbol: 'GBPCAD', name: 'British Pound / Canadian Dollar', sessions: ['London', 'New York'] },
  { id: 'gbpnzd', symbol: 'GBPNZD', name: 'British Pound / New Zealand Dollar', sessions: ['London', 'Sydney'] },
  { id: 'nzdcad', symbol: 'NZDCAD', name: 'New Zealand Dollar / Canadian Dollar', sessions: ['Sydney', 'New York'] },
  { id: 'nzdchf', symbol: 'NZDCHF', name: 'New Zealand Dollar / Swiss Franc', sessions: ['Sydney', 'London'] },
  { id: 'nzdjpy', symbol: 'NZDJPY', name: 'New Zealand Dollar / Japanese Yen', sessions: ['Tokyo', 'Sydney'] },
  { id: 'xauusd', symbol: 'XAUUSD', name: 'Gold / US Dollar', sessions: ['New York'] },
  { id: 'xagusd', symbol: 'XAGUSD', name: 'Silver / US Dollar', sessions: ['New York'] },
  { id: 'wtiusd', symbol: 'WTIUSD', name: 'WTI Oil / US Dollar', sessions: ['New York'] }
];

const STORAGE_KEY = 'forex-session-advisor-selected-pairs';

export const useForexData = () => {
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);

  // Load selected pairs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedPairs(parsed);
        }
      } catch (error) {
        console.error('Error loading selected pairs:', error);
      }
    }
  }, []);

  // Save selected pairs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPairs));
  }, [selectedPairs]);

  const togglePair = (pairId: string) => {
    setSelectedPairs(prev => {
      if (prev.includes(pairId)) {
        return prev.filter(id => id !== pairId);
      } else if (prev.length < 10) {
        return [...prev, pairId];
      }
      return prev;
    });
  };

  const clearSelectedPairs = () => {
    setSelectedPairs([]);
  };

  return {
    forexPairs: FOREX_PAIRS,
    selectedPairs,
    togglePair,
    clearSelectedPairs
  };
};