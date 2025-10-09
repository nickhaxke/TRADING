import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, AlertCircle, Crown, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Signal {
  id: string;
  title: string;
  description: string;
  pair: string;
  signal_type: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number | null;
  take_profit_3: number | null;
  status: 'ACTIVE' | 'CLOSED' | 'HIT_TP1' | 'HIT_TP2' | 'HIT_TP3' | 'HIT_SL';
  signal_tier: 'FREE' | 'PREMIUM';
  posted_at: string;
  closed_at: string | null;
  result_pips: number | null;
  notes: string | null;
}

export const Signals: React.FC = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'closed'>('all');
  const [userRole, setUserRole] = useState<'user' | 'premium' | 'admin'>('user');

  useEffect(() => {
    fetchUserRole();
    fetchSignals();
  }, []);

  const fetchUserRole = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setUserRole(data.role);
    }
  };

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) throw error;

      setSignals(data || []);
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignals = signals.filter(signal => {
    if (activeTab === 'active') return signal.status === 'ACTIVE';
    if (activeTab === 'closed') return signal.status !== 'ACTIVE';
    return true;
  });

  const canViewSignal = (signal: Signal) => {
    if (signal.signal_tier === 'FREE') return true;
    return userRole === 'premium' || userRole === 'admin';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      HIT_TP1: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      HIT_TP2: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      HIT_TP3: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      HIT_SL: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return badges[status as keyof typeof badges] || badges.ACTIVE;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading signals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Trading Signals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {userRole === 'premium' || userRole === 'admin'
              ? 'Access to all premium signals'
              : 'Free signals available - Upgrade for premium signals'}
          </p>
        </div>

        {userRole === 'user' && (
          <Link to="/upgrade" className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg">
            <Crown className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </Link>
        )}
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Signals
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'closed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Closed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSignals.map((signal) => {
          const isLocked = !canViewSignal(signal);

          return (
            <div
              key={signal.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
                isLocked ? 'opacity-75' : ''
              }`}
            >
              <div className={`p-1 ${
                signal.signal_type === 'BUY'
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`} />

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {signal.pair}
                      </h3>
                      {signal.signal_tier === 'PREMIUM' && (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{signal.title}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      signal.signal_type === 'BUY'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {signal.signal_type === 'BUY' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {signal.signal_type}
                    </span>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(signal.status)}`}>
                        {signal.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {isLocked ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <Lock className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      Premium Signal - Upgrade to view
                    </p>
                    <Link to="/upgrade" className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all text-sm">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Link>
                  </div>
                ) : (
                  <>
                    {signal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {signal.description}
                      </p>
                    )}

                    <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Entry Price:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{signal.entry_price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stop Loss:</span>
                        <span className="text-sm font-bold text-red-600">{signal.stop_loss}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Take Profit 1:</span>
                        <span className="text-sm font-bold text-green-600">{signal.take_profit_1}</span>
                      </div>
                      {signal.take_profit_2 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Take Profit 2:</span>
                          <span className="text-sm font-bold text-green-600">{signal.take_profit_2}</span>
                        </div>
                      )}
                      {signal.take_profit_3 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Take Profit 3:</span>
                          <span className="text-sm font-bold text-green-600">{signal.take_profit_3}</span>
                        </div>
                      )}
                    </div>

                    {signal.result_pips !== null && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        signal.result_pips > 0
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        <p className={`text-sm font-bold ${
                          signal.result_pips > 0
                            ? 'text-green-800 dark:text-green-400'
                            : 'text-red-800 dark:text-red-400'
                        }`}>
                          Result: {signal.result_pips > 0 ? '+' : ''}{signal.result_pips} pips
                        </p>
                      </div>
                    )}

                    {signal.notes && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {signal.notes}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(signal.posted_at)}
                      </div>
                      {signal.closed_at && (
                        <div>Closed: {formatDate(signal.closed_at)}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSignals.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No signals available</p>
        </div>
      )}
    </div>
  );
};
