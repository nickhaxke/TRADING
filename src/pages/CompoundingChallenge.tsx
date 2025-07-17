import React, { useState, useEffect } from 'react';
import { useCompoundingChallenge } from '../hooks/useCompoundingChallenge';
import { 
  TrendingUp, 
  Plus, 
  RotateCcw, 
  Download, 
  Target,
  DollarSign,
  Award,
  Activity,
  CheckCircle,
  XCircle,
  Camera,
  Save,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImageUrlInput } from '../components/ImageUpload';

export const CompoundingChallenge: React.FC = () => {
  const { 
    challengeTrades, 
    challengeSettings,
    loading, 
    addChallengeTrade, 
    resetChallenge,
    updateChallengeSettings,
    exportToPDF,
    exportToCSV 
  } = useCompoundingChallenge();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [formData, setFormData] = useState({
    result: '',
    notes: '',
    screenshot_url: ''
  });
  const [settingsData, setSettingsData] = useState({
    starting_amount: challengeSettings?.starting_amount || 100,
    risk_percentage: challengeSettings?.risk_percentage || 2,
    reward_ratio: challengeSettings?.reward_ratio || 2
  });

  // Calculate current stats
  const currentBalance = challengeTrades.length > 0 
    ? challengeTrades[challengeTrades.length - 1].final_balance 
    : challengeSettings?.starting_amount || 100;
  
  const completedTrades = challengeTrades.length;
  const winningTrades = challengeTrades.filter(trade => trade.result === 'win').length;
  const winRate = completedTrades > 0 ? (winningTrades / completedTrades) * 100 : 0;
  
  const totalProfit = currentBalance - (challengeSettings?.starting_amount || 100);
  const avgProfitPerTrade = completedTrades > 0 ? totalProfit / completedTrades : 0;

  // Prepare chart data
  const chartData = [
    { trade: 0, balance: challengeSettings?.starting_amount || 100 },
    ...challengeTrades.map((trade, index) => ({
      trade: index + 1,
      balance: trade.final_balance
    }))
  ];

  const riskRewardOptions = [
    { value: 1.5, label: '1:1.5' },
    { value: 2, label: '1:2' },
    { value: 2.5, label: '1:2.5' },
    { value: 3, label: '1:3' },
    { value: 4, label: '1:4' },
    { value: 5, label: '1:5' }
  ];

  const riskPercentageOptions = [
    { value: 1, label: '1%' },
    { value: 2, label: '2%' },
    { value: 3, label: '3%' },
    { value: 5, label: '5%' },
    { value: 10, label: '10%' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addChallengeTrade({
        result: formData.result as 'win' | 'loss',
        notes: formData.notes,
        screenshot_url: formData.screenshot_url || null
      });
      
      setFormData({ result: '', notes: '', screenshot_url: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding challenge trade:', error);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateChallengeSettings(settingsData);
      setShowSettingsForm(false);
    } catch (error) {
      console.error('Error updating challenge settings:', error);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the challenge? This will delete all trades.')) {
      resetChallenge();
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF();
    } finally {
      setExporting(false);
    }
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, screenshot_url: url }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, screenshot_url: '' }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400">Loading challenge...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Compounding Challenge
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ${challengeSettings?.starting_amount || 100} → Target: Transform with {challengeSettings?.risk_percentage || 2}% risk per trade (1:{challengeSettings?.reward_ratio || 2} R:R)
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowSettingsForm(true)}
            disabled={completedTrades > 0}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={completedTrades > 0 ? "Cannot change settings after starting trades" : "Configure challenge settings"}
          >
            <Target className="h-4 w-4 mr-2" />
            Settings
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            disabled={completedTrades >= 30}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trade ({completedTrades}/30)
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              disabled={exporting || completedTrades === 0}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {exporting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              PDF
            </button>
            
            <button
              onClick={exportToCSV}
              disabled={completedTrades === 0}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
            
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${currentBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalProfit.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${totalProfit >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              <TrendingUp className={`h-6 w-6 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {winRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trades</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTrades}/30
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Balance Chart */}
      {chartData.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Balance Progression
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trade" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Balance']}
                labelFormatter={(label) => `Trade ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add Trade Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Trade #{completedTrades + 1}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Trade Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Starting Balance:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">${currentBalance.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Risk Amount ({challengeSettings?.risk_percentage || 2}%):</span>
                  <p className="font-semibold text-red-600">${(currentBalance * ((challengeSettings?.risk_percentage || 2) / 100)).toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Target Profit ({challengeSettings?.reward_ratio || 2}:1):</span>
                  <p className="font-semibold text-green-600">${(currentBalance * ((challengeSettings?.risk_percentage || 2) / 100) * (challengeSettings?.reward_ratio || 2)).toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Potential Balance:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(currentBalance + currentBalance * ((challengeSettings?.risk_percentage || 2) / 100) * (challengeSettings?.reward_ratio || 2)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trade Result *
                </label>
                <select
                  value={formData.result}
                  onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select result...</option>
                  <option value="win">Win (Target Hit)</option>
                  <option value="loss">Loss (Stop Hit)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Trade setup, reasoning, lessons learned..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Camera className="inline h-4 w-4 mr-1" />
                  Trade Screenshot
                </label>
                <ImageUrlInput
                  value={formData.screenshot_url}
                  onChange={handleImageChange}
                  onRemove={handleImageRemove}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Form Modal */}
      {showSettingsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Challenge Settings
              </h3>
              <button
                onClick={() => setShowSettingsForm(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Starting Amount ($) *
                </label>
                <input
                  type="number"
                  min="10"
                  max="100000"
                  step="0.01"
                  value={settingsData.starting_amount}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, starting_amount: parseFloat(e.target.value) || 100 }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="100.00"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum: $10, Maximum: $100,000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Percentage *
                </label>
                <select
                  value={settingsData.risk_percentage}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, risk_percentage: parseFloat(e.target.value) }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {riskPercentageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Percentage of balance to risk per trade
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk:Reward Ratio *
                </label>
                <select
                  value={settingsData.reward_ratio}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, reward_ratio: parseFloat(e.target.value) }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {riskRewardOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Target profit multiplier (reward = risk × ratio)
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Preview:</h4>
                <div className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                  <p>Starting Balance: <span className="font-semibold">${settingsData.starting_amount.toFixed(2)}</span></p>
                  <p>Risk per Trade: <span className="font-semibold text-red-600">${(settingsData.starting_amount * (settingsData.risk_percentage / 100)).toFixed(2)} ({settingsData.risk_percentage}%)</span></p>
                  <p>Target Profit: <span className="font-semibold text-green-600">${(settingsData.starting_amount * (settingsData.risk_percentage / 100) * settingsData.reward_ratio).toFixed(2)} (1:{settingsData.reward_ratio})</span></p>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSettingsForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trades History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Challenge History
          </h3>
        </div>

        {challengeTrades.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No trades recorded yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Challenge
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trade #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Start Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Final Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {challengeTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{trade.trade_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${trade.starting_balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ${trade.risk_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ${trade.target_profit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {trade.result === 'win' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-green-600 font-medium">Win</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600 mr-1" />
                            <span className="text-red-600 font-medium">Loss</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${trade.final_balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {trade.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};