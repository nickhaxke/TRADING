import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    setIsIOS(isIOSDevice);
    setIsStandalone(isInStandaloneMode);

    const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed');
    const dismissedAt = hasSeenPrompt ? parseInt(hasSeenPrompt) : 0;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const shouldShowAgain = Date.now() - dismissedAt > sevenDaysInMs;

    if (!isInStandaloneMode && (!hasSeenPrompt || shouldShowAgain)) {
      if (isIOSDevice) {
        setTimeout(() => setShowPrompt(true), 3000);
      } else {
        const handler = (e: Event) => {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
          window.removeEventListener('beforeinstallprompt', handler);
        };
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-dismissed', Date.now().toString());
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Install Trading Journal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get quick access and work offline
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isIOS ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                To install: Tap <span className="font-semibold">Share</span> button below, then select{' '}
                <span className="font-semibold">Add to Home Screen</span>
              </p>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Install App
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="w-full mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
