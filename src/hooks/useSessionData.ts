import { useState, useEffect } from 'react';
import { TradingSession } from '../types/forex';
import { useForexData } from './useForexData';

const SESSIONS = [
  { name: 'Tokyo', utcStart: 0, utcEnd: 9 },
  { name: 'London', utcStart: 7, utcEnd: 16 },
  { name: 'New York', utcStart: 12, utcEnd: 21 },
  { name: 'Sydney', utcStart: 21, utcEnd: 6 } // Crosses midnight
];

export const useSessionData = (selectedPairIds: string[]) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { forexPairs } = useForexData();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const isSessionActive = (session: typeof SESSIONS[0], now: Date): boolean => {
    const utcHour = now.getUTCHours();
    
    if (session.utcEnd > session.utcStart) {
      // Normal session (doesn't cross midnight)
      return utcHour >= session.utcStart && utcHour < session.utcEnd;
    } else {
      // Session crosses midnight (like Sydney)
      return utcHour >= session.utcStart || utcHour < session.utcEnd;
    }
  };

  const getTimeToNextSession = (session: typeof SESSIONS[0], now: Date): number => {
    const utcNow = new Date(now.getTime());
    const currentUtcHour = utcNow.getUTCHours();
    const currentUtcMinute = utcNow.getUTCMinutes();
    const currentUtcSecond = utcNow.getUTCSeconds();
    
    // Create next session start time
    const nextSessionStart = new Date(utcNow);
    nextSessionStart.setUTCHours(session.utcStart, 0, 0, 0);
    
    // If session start time has passed today, move to tomorrow
    if (session.utcStart <= currentUtcHour || 
        (session.utcStart === currentUtcHour && currentUtcMinute > 0)) {
      nextSessionStart.setUTCDate(nextSessionStart.getUTCDate() + 1);
    }
    
    return nextSessionStart.getTime() - utcNow.getTime();
  };

  const formatLocalTime = (utcHour: number): string => {
    const date = new Date();
    date.setUTCHours(utcHour, 0, 0, 0);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getActivePairsForSession = (sessionName: string): string[] => {
    return selectedPairIds
      .map(pairId => forexPairs.find(pair => pair.id === pairId))
      .filter(pair => pair && pair.sessions.includes(sessionName))
      .map(pair => pair!.symbol);
  };

  const sessions: TradingSession[] = SESSIONS.map(session => {
    const isActive = isSessionActive(session, currentTime);
    const timeToNext = isActive ? 0 : getTimeToNextSession(session, currentTime);
    const activePairs = getActivePairsForSession(session.name);

    return {
      name: session.name,
      utcStart: session.utcStart,
      utcEnd: session.utcEnd,
      isActive,
      timeToNext,
      activePairs,
      localStartTime: formatLocalTime(session.utcStart),
      localEndTime: formatLocalTime(session.utcEnd)
    };
  });

  // Sort sessions: active first, then by time to next open
  const sortedSessions = sessions.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    if (!a.isActive && !b.isActive) {
      return a.timeToNext - b.timeToNext;
    }
    return 0;
  });

  return {
    sessions: sortedSessions,
    currentTime,
    userTimezone: getUserTimezone()
  };
};