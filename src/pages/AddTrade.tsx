import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrades } from '../hooks/useTrades';
import { Calculator, Save, X, Camera } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImageUrlInput } from '../components/ImageUpload';

export const AddTrade: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    trade_type: 'buy',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    rr_ratio: '',
    lot_size: '',
    outcome: '',
    reason: '',
    notes: '',
    screenshot_url: '',
    screenshot_file: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { addTrade } = useTrades();
  const navigate = useNavigate();

  // Auto-calculate RR ratio when entry, SL, or TP changes
  useEffect(() => {
    const { entry_price, stop_loss, take_profit, trade_type } = formData;
    if (entry_price && stop_loss && take_profit && trade_type) {
      const entry = parseFloat(entry_price);
      const sl = parseFloat(stop_loss);
      const tp = parseFloat(take_profit);
      
      if (entry > 0 && sl > 0 && tp > 0) {
        let risk, reward;
        
        if (trade_type === 'buy') {
          // For buy trades: risk is entry - SL, reward is TP - entry
          risk = Math.abs(entry - sl);
          reward = Math.abs(tp - entry);
        } else {
          // For sell trades: risk is SL - entry, reward is entry - TP
          risk = Math.abs(sl - entry);
          reward = Math.abs(entry - tp);
        }
        
        const rrRatio = risk > 0 ? reward / risk : 0;
        
        setFormData(prev => ({
          ...prev,
          rr_ratio: rrRatio.toFixed(2)
        }));
      }
    }
  }, [formData.entry_price, formData.stop_loss, formData.take_profit, formData.trade_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await addTrade({
        date: formData.date,
        pair: formData.pair,
        trade_type: formData.trade_type,
        entry_price: parseFloat(formData.entry_price),
        stop_loss: parseFloat(formData.stop_loss),
        take_profit: parseFloat(formData.take_profit),
        rr_ratio: parseFloat(formData.rr_ratio),
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        outcome: parseFloat(formData.outcome),
        reason: formData.reason,
        notes: formData.notes || null,
        screenshot_url: formData.screenshot_url || null
      });
      
      navigate('/trades');
    } catch (err: any) {
      setError(err.message || 'Failed to add trade');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      screenshot_url: url
    }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      screenshot_url: ''
    }));
  };

  const commonPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
    'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD', 'CHFJPY', 'GBPAUD',
    'GBPCHF', 'AUDCAD', 'AUDCHF', 'AUDNZD', 'CADCHF', 'CADJPY', 'EURCHF',
    'EURNZD', 'GBPCAD', 'GBPNZD', 'NZDCAD', 'NZDCHF', 'NZDJPY'
  ];

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col items-center space-y-4 max-w-sm w-full">
            <LoadingSpinner size="lg" />
            <p className="text-gray-900 dark:text-white font-medium">Loading trade form...</p>
          </div>
        </div>
      )}
      
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Add New Trade</h1>
          <button
            onClick={() => navigate('/trades')}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 sm:px-4 py-3 rounded-md text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="trade_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trade Type *
              </label>
              <select
                id="trade_type"
                name="trade_type"
                required
                value={formData.trade_type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label htmlFor="pair" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency Pair *
              </label>
              <select
                id="pair"
                name="pair"
                required
                value={formData.pair}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              >
                <option value="">Select a pair</option>
                {commonPairs.map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="entry_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Price *
              </label>
              <input
                type="number"
                id="entry_price"
                name="entry_price"
                required
                step="0.00001"
                placeholder="1.12345"
                value={formData.entry_price}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="stop_loss" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stop Loss *
              </label>
              <input
                type="number"
                id="stop_loss"
                name="stop_loss"
                required
                step="0.00001"
                placeholder="1.12000"
                value={formData.stop_loss}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="take_profit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Take Profit *
              </label>
              <input
                type="number"
                id="take_profit"
                name="take_profit"
                required
                step="0.00001"
                placeholder="1.13000"
                value={formData.take_profit}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="rr_ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                RR Ratio * (Auto-calculated)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="rr_ratio"
                  name="rr_ratio"
                  required
                  readOnly
                  step="0.01"
                  placeholder="2.50"
                  value={formData.rr_ratio}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 sm:py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm bg-gray-50 dark:bg-gray-600"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Calculator className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Automatically calculated based on trade type, entry, stop loss, and take profit
              </p>
            </div>

            <div>
              <label htmlFor="lot_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lot Size
              </label>
              <input
                type="number"
                id="lot_size"
                name="lot_size"
                step="0.01"
                placeholder="0.10"
                value={formData.lot_size}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Outcome ($) *
              </label>
              <input
                type="number"
                id="outcome"
                name="outcome"
                required
                step="0.01"
                placeholder="250.00"
                value={formData.outcome}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason/Setup *
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              required
              placeholder="e.g., Breakout of resistance, Double top pattern"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Additional notes about the trade..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Camera className="inline h-4 w-4 mr-1" />
              Trade Screenshot URL
            </label>
            <ImageUrlInput
              value={formData.screenshot_url}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter a URL to an image of your trade setup or chart analysis
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/trades')}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-base sm:text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? (
                <LoadingSpinner size="sm" color="border-white" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {submitting ? 'Adding Trade...' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};