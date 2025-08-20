import { useState, useEffect } from 'react';
import { SESSIONS, FOREX_PAIRS, SessionStatus, Session, ForexPair } from '../types/forex';
import { useAuth } from '../contexts/AuthContext';

export const useForexSessions = () => {
  const [sessionStatuses, setSessionStatuses] = useState<SessionStatus[]>([]);
  const { userProfile } = useAuth();

  const getSessionTime = (session: Session, date: Date) => {
    const sessionDate = new Date(date.toLocaleString('en-US', { timeZone: session.timezone }));
    const [openHour, openMinute] = session.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = session.closeTime.split(':').map(Number);
    
    const openTime = new Date(sessionDate);
    openTime.setHours(openHour, openMinute, 0, 0);
    
    const closeTime = new Date(sessionDate);
    closeTime.setHours(closeHour, closeMinute, 0, 0);
    
    return { openTime, closeTime };
  };

  const isSessionOpen = (session: Session, now: Date) => {
    const { openTime, closeTime } = getSessionTime(session, now);
    const currentTime = new Date(now.toLocaleString('en-US', { timeZone: session.timezone }));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const getTimeUntilChange = (session: Session, now: Date) => {
    const { openTime, closeTime } = getSessionTime(session, now);
    const currentTime = new Date(now.toLocaleString('en-US', { timeZone: session.timezone }));
    
    if (currentTime < openTime) {
      return openTime.getTime() - currentTime.getTime();
    } else if (currentTime <= closeTime) {
      return closeTime.getTime() - currentTime.getTime();
    } else {
      // Session is closed, calculate time until next day's opening
      const nextDayOpen = new Date(openTime);
      nextDayOpen.setDate(nextDayOpen.getDate() + 1);
      return nextDayOpen.getTime() - currentTime.getTime();
    }
  };

  const getActivePairs = (session: Session): ForexPair[] => {
    if (!userProfile?.selectedPairs.length) return [];
    
    return FOREX_PAIRS.filter(pair => 
      userProfile.selectedPairs.includes(pair.symbol) &&
      pair.sessions.includes(session.name)
    );
  };

  const updateSessionStatuses = () => {
    const now = new Date();
    const statuses: SessionStatus[] = [];
    
    // Only show sessions that are relevant to user's selected pairs
    const relevantSessions = SESSIONS.filter(session => {
      if (!userProfile?.selectedPairs.length) return false;
      return FOREX_PAIRS.some(pair => 
        userProfile.selectedPairs.includes(pair.symbol) &&
        pair.sessions.includes(session.name)
      );
    });

    relevantSessions.forEach(session => {
      const isOpen = isSessionOpen(session, now);
      const timeUntilChange = getTimeUntilChange(session, now);
      const activePairs = getActivePairs(session);
      
      statuses.push({
        session,
        isOpen,
        timeUntilChange,
        activePairs
      });
    });

    setSessionStatuses(statuses);
  };

  useEffect(() => {
    updateSessionStatuses();
    const interval = setInterval(updateSessionStatuses, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [userProfile?.selectedPairs]);

  const formatTimeUntil = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getCurrentTime = (timezone: string): string => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return {
    sessionStatuses,
    formatTimeUntil,
    getCurrentTime,
    updateSessionStatuses
  };
};