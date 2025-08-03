import { useState, useEffect } from 'react';
import { 
  Trade, 
  getTrades, 
  addTrade as addTradeLocal, 
  updateTrade as updateTradeLocal, 
  deleteTrade as deleteTradeLocal 
} from '../lib/localStorage';
import { useAuth } from '../contexts/AuthContext';

export { Trade } from '../lib/localStorage';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTrades = () => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const localTrades = getTrades();
      setTrades(localTrades);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [user]);

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newTrade = addTradeLocal(tradeData);
      setTrades(prev => [newTrade, ...prev]);
      return newTrade;
    } catch (error) {
      console.error('Error adding trade:', error);
      throw error;
    }
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedTrade = updateTradeLocal(id, updates);
      if (updatedTrade) {
        setTrades(prev => prev.map(trade => trade.id === id ? updatedTrade : trade));
        return updatedTrade;
      }
      throw new Error('Trade not found');
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    }
  };

  const deleteTrade = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const success = deleteTradeLocal(id);
      if (success) {
        setTrades(prev => prev.filter(trade => trade.id !== id));
      } else {
        throw new Error('Trade not found');
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  };

  return {
    trades,
    loading,
    addTrade,
    updateTrade,
    deleteTrade,
    refreshTrades: fetchTrades
  };
};