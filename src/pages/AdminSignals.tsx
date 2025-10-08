import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Signal {
  id?: string;
  title: string;
  description: string;
  pair: string;
  signal_type: 'BUY' | 'SELL';
  entry_price: string;
  stop_loss: string;
  take_profit_1: string;
  take_profit_2: string;
  take_profit_3: string;
  status: 'ACTIVE' | 'CLOSED' | 'HIT_TP1' | 'HIT_TP2' | 'HIT_TP3' | 'HIT_SL';
  signal_tier: 'FREE' | 'PREMIUM';
  result_pips: string;
  notes: string;
}

const emptySignal: Signal = {
  title: '',
  description: '',
  pair: '',
  signal_type: 'BUY',
  entry_price: '',
  stop_loss: '',
  take_profit_1: '',
  take_profit_2: '',
  take_profit_3: '',
  status: 'ACTIVE',
  signal_tier: 'FREE',
  result_pips: '',
  notes: ''
};

export const AdminSignals: React.FC = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal>(emptySignal);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSignals();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const signalData = {
        title: editingSignal.title,
        description: editingSignal.description || null,
        pair: editingSignal.pair,
        signal_type: editingSignal.signal_type,
        entry_price: parseFloat(editingSignal.entry_price),
        stop_loss: parseFloat(editingSignal.stop_loss),
        take_profit_1: parseFloat(editingSignal.take_profit_1),
        take_profit_2: editingSignal.take_profit_2 ? parseFloat(editingSignal.take_profit_2) : null,
        take_profit_3: editingSignal.take_profit_3 ? parseFloat(editingSignal.take_profit_3) : null,
        status: editingSignal.status,
        signal_tier: editingSignal.signal_tier,
        result_pips: editingSignal.result_pips ? parseFloat(editingSignal.result_pips) : null,
        notes: editingSignal.notes || null,
        posted_by: user?.id,
        closed_at: editingSignal.status !== 'ACTIVE' ? new Date().toISOString() : null
      };

      if (editingSignal.id) {
        const { error } = await supabase
          .from('trading_signals')
          .update(signalData)
          .eq('id', editingSignal.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('trading_signals')
          .insert([signalData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingSignal(emptySignal);
      fetchSignals();
    } catch (error: any) {
      console.error('Error saving signal:', error);
      alert('Error saving signal: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (signal: any) => {
    setEditingSignal({
      id: signal.id,
      title: signal.title,
      description: signal.description || '',
      pair: signal.pair,
      signal_type: signal.signal_type,
      entry_price: signal.entry_price.toString(),
      stop_loss: signal.stop_loss.toString(),
      take_profit_1: signal.take_profit_1.toString(),
      take_profit_2: signal.take_profit_2?.toString() || '',
      take_profit_3: signal.take_profit_3?.toString() || '',
      status: signal.status,
      signal_tier: signal.signal_tier,
      result_pips: signal.result_pips?.toString() || '',
      notes: signal.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this signal?')) return;

    try {
      const { error } = await supabase
        .from('trading_signals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSignals();
    } catch (error) {
      console.error('Error deleting signal:', error);
    }
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
            <TrendingUp className="h-8 w-8 text-purple-600" />
            Signal Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Post and manage trading signals for users
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Admin
          </Link>
          <button
            onClick={() => {
              setEditingSignal(emptySignal);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Signal
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSignal.id ? 'Edit Signal' : 'New Signal'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSignal(emptySignal);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Signal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSignal.title}
                    onChange={(e) => setEditingSignal({ ...editingSignal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., EUR/USD Buy Signal - London Session"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingSignal.description}
                    onChange={(e) => setEditingSignal({ ...editingSignal, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Additional details about the signal..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trading Pair *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSignal.pair}
                    onChange={(e) => setEditingSignal({ ...editingSignal, pair: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="EUR/USD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Signal Type *
                  </label>
                  <select
                    required
                    value={editingSignal.signal_type}
                    onChange={(e) => setEditingSignal({ ...editingSignal, signal_type: e.target.value as 'BUY' | 'SELL' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Entry Price *
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingSignal.entry_price}
                    onChange={(e) => setEditingSignal({ ...editingSignal, entry_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1.09500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stop Loss *
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingSignal.stop_loss}
                    onChange={(e) => setEditingSignal({ ...editingSignal, stop_loss: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1.09200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Take Profit 1 *
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    required
                    value={editingSignal.take_profit_1}
                    onChange={(e) => setEditingSignal({ ...editingSignal, take_profit_1: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1.09800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Take Profit 2
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    value={editingSignal.take_profit_2}
                    onChange={(e) => setEditingSignal({ ...editingSignal, take_profit_2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1.10100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Take Profit 3
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    value={editingSignal.take_profit_3}
                    onChange={(e) => setEditingSignal({ ...editingSignal, take_profit_3: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1.10400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={editingSignal.status}
                    onChange={(e) => setEditingSignal({ ...editingSignal, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="HIT_TP1">HIT TP1</option>
                    <option value="HIT_TP2">HIT TP2</option>
                    <option value="HIT_TP3">HIT TP3</option>
                    <option value="HIT_SL">HIT SL</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Signal Tier *
                  </label>
                  <select
                    required
                    value={editingSignal.signal_tier}
                    onChange={(e) => setEditingSignal({ ...editingSignal, signal_tier: e.target.value as 'FREE' | 'PREMIUM' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Result (Pips)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingSignal.result_pips}
                    onChange={(e) => setEditingSignal({ ...editingSignal, result_pips: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+30 or -20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editingSignal.notes}
                    onChange={(e) => setEditingSignal({ ...editingSignal, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Additional updates or notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSignal(emptySignal);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Signal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Signal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {signals.map((signal) => (
                <tr key={signal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {signal.pair}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {signal.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      signal.signal_type === 'BUY'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {signal.signal_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {signal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      signal.signal_tier === 'PREMIUM'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {signal.signal_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {signal.result_pips ? `${signal.result_pips > 0 ? '+' : ''}${signal.result_pips} pips` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(signal)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(signal.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {signals.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No signals yet. Create your first signal!</p>
          </div>
        )}
      </div>
    </div>
  );
};
