import { useState, useEffect } from 'react';
import { useSessionData } from './useSessionData';
import { useForexData } from './useForexData';

const STORAGE_KEY = 'forex-session-advisor-notifications';

export const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { selectedPairs } = useForexData();
  const { sessions } = useSessionData(selectedPairs);

  // Load notification settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotificationsEnabled(parsed.enabled || false);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }

    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save notification settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enabled: notificationsEnabled
    }));
  }, [notificationsEnabled]);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const scheduleNotification = (sessionName: string, timeToSession: number) => {
    const notificationTime = timeToSession - (15 * 60 * 1000); // 15 minutes before
    
    if (notificationTime <= 0) return; // Too late to schedule

    setTimeout(() => {
      if (notificationsEnabled && Notification.permission === 'granted') {
        new Notification(`${sessionName} Session Opening Soon`, {
          body: `The ${sessionName} trading session will open in 15 minutes`,
          icon: '/favicon.ico',
          tag: `session-${sessionName}`,
          requireInteraction: false
        });
      }
    }, notificationTime);
  };

  // Schedule notifications for upcoming sessions
  useEffect(() => {
    if (!notificationsEnabled || Notification.permission !== 'granted') {
      return;
    }

    sessions.forEach(session => {
      if (!session.isActive && session.activePairs.length > 0) {
        scheduleNotification(session.name, session.timeToNext);
      }
    });
  }, [sessions, notificationsEnabled]);

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  return {
    notificationsEnabled,
    permission,
    toggleNotifications,
    requestPermission
  };
};