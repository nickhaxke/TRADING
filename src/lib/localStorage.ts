// Local Storage utilities for frontend-only app
export interface Trade {
  id: string;
  date: string;
  pair: string;
  trade_type: string;
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
}

export interface ChallengeSettings {
  starting_amount: number;
  risk_percentage: number;
  reward_ratio: number;
}

export interface ChallengeTrade {
  id: string;
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

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Trades management
export const getTrades = (): Trade[] => {
  const trades = localStorage.getItem('trades');
  return trades ? JSON.parse(trades) : [];
};

export const saveTrades = (trades: Trade[]): void => {
  localStorage.setItem('trades', JSON.stringify(trades));
};

export const addTrade = (tradeData: Omit<Trade, 'id' | 'created_at' | 'updated_at'>): Trade => {
  const trades = getTrades();
  const newTrade: Trade = {
    ...tradeData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  trades.unshift(newTrade);
  saveTrades(trades);
  return newTrade;
};

export const updateTrade = (id: string, updates: Partial<Trade>): Trade | null => {
  const trades = getTrades();
  const index = trades.findIndex(trade => trade.id === id);
  if (index === -1) return null;
  
  trades[index] = {
    ...trades[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  saveTrades(trades);
  return trades[index];
};

export const deleteTrade = (id: string): boolean => {
  const trades = getTrades();
  const filteredTrades = trades.filter(trade => trade.id !== id);
  if (filteredTrades.length === trades.length) return false;
  
  saveTrades(filteredTrades);
  return true;
};

// Challenge settings management
export const getChallengeSettings = (): ChallengeSettings => {
  const settings = localStorage.getItem('challenge-settings');
  return settings ? JSON.parse(settings) : {
    starting_amount: 100,
    risk_percentage: 2,
    reward_ratio: 2
  };
};

export const saveChallengeSettings = (settings: ChallengeSettings): void => {
  localStorage.setItem('challenge-settings', JSON.stringify(settings));
};

// Challenge trades management
export const getChallengeTrades = (): ChallengeTrade[] => {
  const trades = localStorage.getItem('challenge-trades');
  return trades ? JSON.parse(trades) : [];
};

export const saveChallengeeTrades = (trades: ChallengeTrade[]): void => {
  localStorage.setItem('challenge-trades', JSON.stringify(trades));
};

export const addChallengeTrade = (tradeData: {
  result: 'win' | 'loss';
  notes: string;
  screenshot_url: string | null;
}): ChallengeTrade => {
  const trades = getChallengeTrades();
  const settings = getChallengeSettings();
  
  const currentBalance = trades.length > 0 
    ? trades[trades.length - 1].final_balance 
    : settings.starting_amount;
  
  const riskAmount = currentBalance * (settings.risk_percentage / 100);
  const targetProfit = riskAmount * settings.reward_ratio;
  const tradeNumber = trades.length + 1;
  
  let finalBalance;
  if (tradeData.result === 'win') {
    finalBalance = currentBalance + targetProfit;
  } else {
    finalBalance = currentBalance - riskAmount;
  }

  const newTrade: ChallengeTrade = {
    id: generateId(),
    trade_number: tradeNumber,
    starting_balance: currentBalance,
    risk_amount: riskAmount,
    target_profit: targetProfit,
    result: tradeData.result,
    final_balance: finalBalance,
    notes: tradeData.notes || null,
    screenshot_url: tradeData.screenshot_url,
    created_at: new Date().toISOString()
  };

  trades.push(newTrade);
  saveChallengeeTrades(trades);
  return newTrade;
};

export const resetChallenge = (): void => {
  localStorage.removeItem('challenge-trades');
};

// Simple auth simulation
export interface User {
  id: string;
  email: string;
  username: string;
}

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('current-user');
  return user ? JSON.parse(user) : null;
};

export const signIn = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple demo authentication
      if (email === 'demo@example.com' && password === 'demo123') {
        const user: User = {
          id: 'demo-user',
          email: 'demo@example.com',
          username: 'Demo User'
        };
        localStorage.setItem('current-user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials. Use demo@example.com / demo123'));
      }
    }, 1000);
  });
};

export const signUp = (email: string, password: string, username: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user: User = {
        id: generateId(),
        email,
        username
      };
      localStorage.setItem('current-user', JSON.stringify(user));
      resolve(user);
    }, 1000);
  });
};

export const signOut = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('current-user');
      resolve();
    }, 500);
  });
};