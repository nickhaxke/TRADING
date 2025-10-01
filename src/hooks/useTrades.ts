import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Cache for trades data
let tradesCache: Trade[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds
export interface Trade {
  id: string;
  user_id: string;
  date: string;
  pair: string;
  trade_type?: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  rr_ratio: number;
  lot_size: number | null;
  outcome: number;
  reason: string;
  notes: string | null;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
  before_image?: string | null;
  after_image?: string | null;
  trading_steps?: string | null;
  before_image?: string | null;
  after_image?: string | null;
  trading_steps?: string | null;
}

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTrades = async () => {
    if (!user) return;
    
    // Check cache first
    const now = Date.now();
    if (tradesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setTrades(tradesCache);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      const tradesData = data || [];
      setTrades(tradesData);
      
      // Update cache
      tradesCache = tradesData;
      cacheTimestamp = now;
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [user]);

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('trades')
      .insert([{ ...tradeData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    setTrades(prev => [data, ...prev]);
    
    // Invalidate cache
    tradesCache = null;
    return data;
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    const { data, error } = await supabase
      .from('trades')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setTrades(prev => prev.map(trade => trade.id === id ? data : trade));
    
    // Invalidate cache
    tradesCache = null;
    return data;
  };

  const deleteTrade = async (id: string) => {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTrades(prev => prev.filter(trade => trade.id !== id));
    
    // Invalidate cache
    tradesCache = null;
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