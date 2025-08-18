import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface ChallengeSettings {
  id: string;
  user_id: string;
  starting_amount: number;
  risk_percentage: number;
  reward_ratio: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeTrade {
  id: string;
  user_id: string;
  trade_number: number;
  starting_balance: number;
  risk_amount: number;
  target_profit: number;
  result: 'win' | 'loss';
  final_balance: number;
  notes: string | null;
  screenshot_url: string | null;
  created_at: string;
}

export const useCompoundingChallenge = () => {
  const [challengeTrades, setChallengeTrades] = useState<ChallengeTrade[]>([]);
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallengeSettings = async () => {
    if (!user) return;
    
    try {
      // First try to get existing settings
      let { data, error } = await supabase
        .from('challenge_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        // Settings found, use them
        setChallengeSettings(data);
        return;
      }
      
      // No settings found (PGRST116 error), create default settings
      if (error && error.code === 'PGRST116') {
        const defaultSettings = {
          user_id: user.id,
          starting_amount: 100,
          risk_percentage: 2,
          reward_ratio: 2
        };
        
        try {
          // Try to insert new settings
          const { data: newSettings, error: createError } = await supabase
            .from('challenge_settings')
            .insert([defaultSettings])
            .select()
            .single();
          
          if (createError) {
            // Check if it's a duplicate key error (race condition)
            if (createError.code === '23505') {
              // Another process created settings, fetch them
              const { data: existingSettings, error: fetchError } = await supabase
                .from('challenge_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();
              
              if (fetchError) throw fetchError;
              setChallengeSettings(existingSettings);
            } else {
              throw createError;
            }
          } else {
            setChallengeSettings(newSettings);
          }
        } catch (insertError) {
          console.error('Error creating challenge settings:', insertError);
          throw insertError;
        }
      } else if (error) {
        // Other unexpected error
        throw error;
      }
    } catch (error) {
      console.error('Error fetching challenge settings:', error);
      throw error;
    }
  };

  const fetchChallengeTrades = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('challenge_trades')
        .select('*')
        .eq('user_id', user.id)
        .order('trade_number', { ascending: true });
      
      if (error) throw error;
      setChallengeTrades(data || []);
    } catch (error) {
      console.error('Error fetching challenge trades:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchChallengeSettings();
      await fetchChallengeTrades();
      setLoading(false);
    };
    
    loadData();
  }, [user]);

  const updateChallengeSettings = async (settings: {
    starting_amount: number;
    risk_percentage: number;
    reward_ratio: number;
  }) => {
    if (!user || !challengeSettings) return;

    const { data, error } = await supabase
      .from('challenge_settings')
      .update({
        starting_amount: settings.starting_amount,
        risk_percentage: settings.risk_percentage,
        reward_ratio: settings.reward_ratio,
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeSettings.id)
      .select()
      .single();

    if (error) throw error;
    setChallengeSettings(data);
    return data;
  };

  const addChallengeTrade = async (tradeData: {
    result: 'win' | 'loss';
    notes: string;
    screenshot_url: string | null;
  }) => {
    if (!user || !challengeSettings) return;

    // Calculate trade details
    const currentBalance = challengeTrades.length > 0 
      ? challengeTrades[challengeTrades.length - 1].final_balance 
      : challengeSettings.starting_amount;
    
    const riskAmount = currentBalance * (challengeSettings.risk_percentage / 100);
    const targetProfit = riskAmount * challengeSettings.reward_ratio;
    const tradeNumber = challengeTrades.length + 1;
    
    let finalBalance;
    if (tradeData.result === 'win') {
      finalBalance = currentBalance + targetProfit;
    } else {
      finalBalance = currentBalance - riskAmount;
    }

    const { data, error } = await supabase
      .from('challenge_trades')
      .insert([{
        user_id: user.id,
        trade_number: tradeNumber,
        starting_balance: currentBalance,
        risk_amount: riskAmount,
        target_profit: targetProfit,
        result: tradeData.result,
        final_balance: finalBalance,
        notes: tradeData.notes || null,
        screenshot_url: tradeData.screenshot_url
      }])
      .select()
      .single();

    if (error) throw error;
    setChallengeTrades(prev => [...prev, data]);
    return data;
  };

  const resetChallenge = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('challenge_trades')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
    setChallengeTrades([]);
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
        
        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }
    
      // Detailed trades with notes and images
      for (let i = 0; i < challengeTrades.length; i++) {
        const trade = challengeTrades[i];
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Trade #${trade.trade_number} - ${trade.result === 'win' ? 'WIN' : 'LOSS'}`, 14, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Starting Balance: $${trade.starting_balance.toFixed(2)}`, 14, yPosition);
        doc.text(`Risk: $${trade.risk_amount.toFixed(2)}`, 80, yPosition);
        doc.text(`Target: $${trade.target_profit.toFixed(2)}`, 140, yPosition);
        yPosition += 6;
        
        doc.text(`Final Balance: $${trade.final_balance.toFixed(2)}`, 14, yPosition);
        doc.text(`Date: ${new Date(trade.created_at).toLocaleDateString()}`, 80, yPosition);
        yPosition += 8;
        
        if (trade.notes) {
          const noteLines = doc.splitTextToSize(`Notes: ${trade.notes}`, 180);
          doc.text(noteLines, 14, yPosition);
          yPosition += noteLines.length * 6;
        }
        
        // Add image if available
        if (trade.screenshot_url) {
          try {
            let imageDataUrl: string | null = null;
            
            try {
              const response = await fetch(trade.screenshot_url, {
                mode: 'cors',
                credentials: 'omit'
              });
              
              if (response.ok) {
                const blob = await response.blob();
                imageDataUrl = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              }
            } catch (fetchError) {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = trade.screenshot_url!;
              });
              
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            }
            
            if (imageDataUrl) {
              const tempImg = new Image();
              await new Promise((resolve) => {
                tempImg.onload = resolve;
                tempImg.src = imageDataUrl!;
              });
              
              const maxWidth = 180;
              const maxHeight = 80;
              let { width, height } = tempImg;
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
              
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
              
              if (yPosition + height > 280) {
                doc.addPage();
                yPosition = 20;
              }
              
              doc.addImage(imageDataUrl, 'JPEG', 14, yPosition, width, height);
              yPosition += height + 5;
            } else {
              doc.text(`Screenshot: ${trade.screenshot_url}`, 14, yPosition);
              yPosition += 6;
            }
            
          } catch (error) {
            console.warn('Error processing image for PDF:', error);
            doc.text(`Screenshot: ${trade.screenshot_url}`, 14, yPosition);
            yPosition += 6;
          }
        }
        
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPosition, 196, yPosition);
        yPosition += 10;
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