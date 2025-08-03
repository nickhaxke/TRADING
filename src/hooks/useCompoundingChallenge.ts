import { useState, useEffect } from 'react';
import { 
  ChallengeSettings,
  ChallengeTrade,
  getChallengeSettings,
  saveChallengeSettings,
  getChallengeTrades,
  addChallengeTrade as addChallengeTradeLocal,
  resetChallenge as resetChallengeLocal
} from '../lib/localStorage';
import { useAuth } from '../contexts/AuthContext';

export { ChallengeSettings, ChallengeTrade } from '../lib/localStorage';

export const useCompoundingChallenge = () => {
  const [challengeTrades, setChallengeTrades] = useState<ChallengeTrade[]>([]);
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallengeSettings = () => {
    if (!user) return;
    
    try {
      const settings = getChallengeSettings();
      setChallengeSettings(settings);
    } catch (error) {
      console.error('Error fetching challenge settings:', error);
    }
  };

  const fetchChallengeTrades = () => {
    if (!user) return;
    
    try {
      const trades = getChallengeTrades();
      setChallengeTrades(trades);
    } catch (error) {
      console.error('Error fetching challenge trades:', error);
    }
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      fetchChallengeSettings();
      fetchChallengeTrades();
      setLoading(false);
    };
    
    loadData();
  }, [user]);

  const updateChallengeSettings = async (settings: {
    starting_amount: number;
    risk_percentage: number;
    reward_ratio: number;
  }) => {
    if (!user) return;

    try {
      saveChallengeSettings(settings);
      setChallengeSettings(settings);
      return settings;
    } catch (error) {
      console.error('Error updating challenge settings:', error);
      throw error;
    }
  };

  const addChallengeTrade = async (tradeData: {
    result: 'win' | 'loss';
    notes: string;
    screenshot_url: string | null;
  }) => {
    if (!user || !challengeSettings) return;

    try {
      const newTrade = addChallengeTradeLocal(tradeData);
      setChallengeTrades(prev => [...prev, newTrade]);
      return newTrade;
    } catch (error) {
      console.error('Error adding challenge trade:', error);
      throw error;
    }
  };

  const resetChallenge = async () => {
    if (!user) return;

    try {
      resetChallengeLocal();
      setChallengeTrades([]);
    } catch (error) {
      console.error('Error resetting challenge:', error);
      throw error;
    }
  };

  const exportToPDF = async () => {
    if (!challengeSettings) return;
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      let yPosition = 22;
    
      // Title
      doc.setFontSize(20);
      doc.text('Compounding Challenge Report', 14, yPosition);
      yPosition += 10;
    
      // Date
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, yPosition);
      yPosition += 10;
    
      // Challenge stats
      const currentBalance = challengeTrades.length > 0 
        ? challengeTrades[challengeTrades.length - 1].final_balance 
        : challengeSettings.starting_amount;
      const totalProfit = currentBalance - challengeSettings.starting_amount;
      const winningTrades = challengeTrades.filter(trade => trade.result === 'win').length;
      const winRate = challengeTrades.length > 0 ? (winningTrades / challengeTrades.length) * 100 : 0;
    
      doc.text(`Starting Balance: $${challengeSettings.starting_amount.toFixed(2)}`, 14, yPosition);
      yPosition += 8;
      doc.text(`Current Balance: $${currentBalance.toFixed(2)}`, 14, yPosition);
      yPosition += 8;
      doc.text(`Total Profit: $${totalProfit.toFixed(2)}`, 14, yPosition);
      yPosition += 8;
      doc.text(`Risk per Trade: ${challengeSettings.risk_percentage}%`, 14, yPosition);
      yPosition += 8;
      doc.text(`Risk:Reward Ratio: 1:${challengeSettings.reward_ratio}`, 14, yPosition);
      yPosition += 8;
      doc.text(`Trades Completed: ${challengeTrades.length}/30`, 14, yPosition);
      yPosition += 8;
      doc.text(`Win Rate: ${winRate.toFixed(1)}%`, 14, yPosition);
      yPosition += 15;
    
      // Trades table
      if (challengeTrades.length > 0) {
        const tableColumns = ['Trade #', 'Start Balance', 'Risk', 'Target', 'Result', 'Final Balance'];
        const tableRows = challengeTrades.map(trade => [
          `#${trade.trade_number}`,
          `$${trade.starting_balance.toFixed(2)}`,
          `$${trade.risk_amount.toFixed(2)}`,
          `$${trade.target_profit.toFixed(2)}`,
          trade.result === 'win' ? 'Win' : 'Loss',
          `$${trade.final_balance.toFixed(2)}`
        ]);
        
        autoTable(doc, {
          head: [tableColumns],
          body: tableRows,
          startY: yPosition,
          styles: { fontSize: 10 },
          columnStyles: { 
            0: { cellWidth: 20 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 30 }
          }
        });
      }
    
      doc.save(`compounding-challenge-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportToCSV = () => {
    if (challengeTrades.length === 0) return;

    const headers = [
      'Trade Number',
      'Starting Balance',
      'Risk Amount',
      'Target Profit',
      'Result',
      'Final Balance',
      'Notes',
      'Screenshot URL',
      'Date'
    ];

    const csvData = challengeTrades.map(trade => [
      trade.trade_number,
      trade.starting_balance.toFixed(2),
      trade.risk_amount.toFixed(2),
      trade.target_profit.toFixed(2),
      trade.result,
      trade.final_balance.toFixed(2),
      trade.notes || '',
      trade.screenshot_url || '',
      new Date(trade.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compounding-challenge-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    challengeTrades,
    challengeSettings,
    loading,
    addChallengeTrade,
    updateChallengeSettings,
    resetChallenge,
    exportToPDF,
    exportToCSV,
    refreshChallengeTrades: fetchChallengeTrades,
    refreshChallengeSettings: fetchChallengeSettings
  };
};