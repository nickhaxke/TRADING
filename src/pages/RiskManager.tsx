import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, AlertTriangle, TrendingUp, Target, Info } from 'lucide-react';

export const RiskManager: React.FC = () => {
  const [formData, setFormData] = useState({
    accountBalance: '',
    riskPercentage: '',
    stopLossPips: '',
    pair: ''
  });
  
  const [result, setResult] = useState<{
    dollarRisk: number;
    dollarPerPip: number;
    lotSize: number;
    pipValue: number;
    warning?: string;
    calculations: {
      accountBalance: number;
      riskPercentage: number;
      dollarRisk: number;
      stopLossPips: number;
      dollarPerPip: number;
      lotSize: number;
    };
  } | null>(null);

  const forexPairs = [
    { value: 'EURUSD', label: 'EUR/USD', pipValue: 10, type: 'major' },
    { value: 'GBPUSD', label: 'GBP/USD', pipValue: 10, type: 'major' },
    { value: 'USDCHF', label: 'USD/CHF', pipValue: 10, type: 'major' },
    { value: 'AUDUSD', label: 'AUD/USD', pipValue: 10, type: 'major' },
    { value: 'USDCAD', label: 'USD/CAD', pipValue: 10, type: 'major' },
    { value: 'NZDUSD', label: 'NZD/USD', pipValue: 10, type: 'major' },
    { value: 'USDJPY', label: 'USD/JPY', pipValue: 9.1, type: 'jpy' },
    { value: 'EURJPY', label: 'EUR/JPY', pipValue: 9.1, type: 'jpy' },
    { value: 'GBPJPY', label: 'GBP/JPY', pipValue: 9.1, type: 'jpy' },
    { value: 'AUDJPY', label: 'AUD/JPY', pipValue: 9.1, type: 'jpy' },
    { value: 'CADJPY', label: 'CAD/JPY', pipValue: 9.1, type: 'jpy' },
    { value: 'CHFJPY', label: 'CHF/JPY', pipValue: 9.1, type: 'jpy' },
    { value: 'XAUUSD', label: 'Gold (XAU/USD)', pipValue: 10, type: 'gold' },
    { value: 'NAS100', label: 'NASDAQ 100', pipValue: 1, type: 'index' },
    { value: 'US30', label: 'Dow Jones 30', pipValue: 1, type: 'index' },
    { value: 'SPX500', label: 'S&P 500', pipValue: 1, type: 'index' }
  ];

  const calculateRisk = () => {
    const balance = parseFloat(formData.accountBalance);
    const riskPercent = parseFloat(formData.riskPercentage);
    const stopLoss = parseFloat(formData.stopLossPips);
    const selectedPair = forexPairs.find(p => p.value === formData.pair);

    if (!balance || !riskPercent || !stopLoss || !selectedPair) {
      setResult(null);
      return;
    }

    // Step 1: Calculate dollar risk
    const dollarRisk = balance * (riskPercent / 100);

    // Step 2: Calculate dollar per pip allowed
    const dollarPerPip = dollarRisk / stopLoss;

    // Step 3: Calculate lot size based on pair type
    let lotSize: number;
    let pipValue = selectedPair.pipValue;

    if (selectedPair.type === 'gold') {
      // Gold: $1 per pip per 0.10 lot, so $10 per pip per 1.00 lot
      lotSize = dollarPerPip / 10;
    } else if (selectedPair.type === 'index') {
      // Indices: typically $1 per point
      lotSize = dollarPerPip / 1;
    } else {
      // Forex pairs
      lotSize = dollarPerPip / pipValue;
    }

    // Round to appropriate decimal places
    lotSize = Math.round(lotSize * 100) / 100;

    // Generate warnings
    let warning = '';
    if (riskPercent > 10) {
      warning = '⚠️ WARNING: Risk percentage above 10% is extremely dangerous!';
    } else if (riskPercent > 5) {
      warning = '⚠️ CAUTION: Risk percentage above 5% is considered high risk.';
    } else if (riskPercent > 2) {
      warning = '💡 NOTE: Consider reducing risk to 1-2% for better risk management.';
    }

    if (balance < 100) {
      warning += warning ? ' ' : '';
      warning += '⚠️ Account balance is very low - consider funding more capital.';
    }

    setResult({
      dollarRisk,
      dollarPerPip,
      lotSize,
      pipValue,
      warning,
      calculations: {
        accountBalance: balance,
        riskPercentage: riskPercent,
        dollarRisk,
        stopLossPips: stopLoss,
        dollarPerPip,
        lotSize
      }
    });
  };

  useEffect(() => {
    calculateRisk();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedPairInfo = forexPairs.find(p => p.value === formData.pair);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Forex Risk Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate the exact lot size based on your risk parameters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="accountBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Balance ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="accountBalance"
                  name="accountBalance"
                  step="0.01"
                  placeholder="198.00"
                  value={formData.accountBalance}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="riskPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Percentage (%) *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="riskPercentage"
                  name="riskPercentage"
                  step="0.1"
                  placeholder="2.0"
                  value={formData.riskPercentage}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 1-2% for conservative, 3-5% for aggressive
              </p>
            </div>

            <div>
              <label htmlFor="stopLossPips" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stop Loss (Pips) *
              </label>
              <input
                type="number"
                id="stopLossPips"
                name="stopLossPips"
                step="1"
                placeholder="25"
                value={formData.stopLossPips}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="pair" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pair/Instrument *
              </label>
              <select
                id="pair"
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select pair/instrument</option>
                <optgroup label="Forex Majors">
                  {forexPairs.filter(p => p.type === 'major').map(pair => (
                    <option key={pair.value} value={pair.value}>{pair.label}</option>
                  ))}
                </optgroup>
                <optgroup label="JPY Pairs">
                  {forexPairs.filter(p => p.type === 'jpy').map(pair => (
                    <option key={pair.value} value={pair.value}>{pair.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Commodities">
                  {forexPairs.filter(p => p.type === 'gold').map(pair => (
                    <option key={pair.value} value={pair.value}>{pair.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Indices">
                  {forexPairs.filter(p => p.type === 'index').map(pair => (
                    <option key={pair.value} value={pair.value}>{pair.label}</option>
                  ))}
                </optgroup>
              </select>
              {selectedPairInfo && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Pip value: ${selectedPairInfo.pipValue} per pip per 1.00 lot
                  {selectedPairInfo.type === 'gold' && ' (Gold: $1 per pip per 0.10 lot)'}
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Risk Calculation Results
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Balance:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${result.calculations.accountBalance.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Risk %:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.calculations.riskPercentage}% → ${result.dollarRisk.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stop Loss:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.calculations.stopLossPips} pips
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dollar per pip allowed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${result.dollarPerPip.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white font-semibold">Correct Lot Size:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {result.lotSize.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {result.warning && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {result.warning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Fill in all fields to calculate your lot size
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
              How Risk Calculation Works
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p><strong>Step 1:</strong> Calculate dollar risk = Account balance × Risk%</p>
              <p><strong>Step 2:</strong> Calculate dollar per pip = Dollar risk ÷ Stop loss pips</p>
              <p><strong>Step 3:</strong> Calculate lot size using pip values:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Forex majors: $10 per pip per 1.00 lot</li>
                <li>JPY pairs: $9.1 per pip per 1.00 lot (approx)</li>
                <li>Gold (XAUUSD): $1 per pip per 0.10 lot</li>
                <li>Indices: $1 per point per contract</li>
              </ul>
              <p><strong>Step 4:</strong> Final lot size = Dollar per pip ÷ Pip value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};