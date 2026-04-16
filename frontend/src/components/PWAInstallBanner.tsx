import { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                             (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if user dismissed banner recently
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show banner if not dismissed recently and not installed
    if (!isStandaloneMode && daysSinceDismissed > 7) {
      setShowBanner(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted install');
    } else {
      console.log('User dismissed install');
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Don't show if user dismissed and no prompt available
  if (!showBanner) {
    return null;
  }

  // iOS specific banner
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background to-transparent pointer-events-none">
        <Card className="pointer-events-auto bg-primary text-primary-foreground p-4 shadow-2xl border-2 border-primary">
          <div className="flex items-start gap-3">
            <Smartphone className="h-6 w-6 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-lg mb-1">Install ZimVerify App</h3>
              <p className="text-sm opacity-90 mb-2">
                For Police & Customs: Install for offline access during field operations
              </p>
              <div className="text-xs opacity-80 space-y-1 bg-primary-foreground/10 p-2 rounded">
                <p>📱 Tap Share button (below) → "Add to Home Screen"</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-primary-foreground/80 hover:text-primary-foreground transition flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Android/Desktop banner with install button
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background to-transparent pointer-events-none">
      <Card className="pointer-events-auto bg-primary text-primary-foreground p-4 shadow-2xl border-2 border-primary">
        <div className="flex items-start gap-3">
          <Download className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg mb-1">Install ZimVerify App</h3>
            <p className="text-sm opacity-90 mb-3">
              {deferredPrompt 
                ? "Install now for offline access, faster performance, and native app experience" 
                : "Add to home screen for quick access and offline capability"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {deferredPrompt ? (
                <Button 
                  onClick={handleInstall}
                  size="sm"
                  variant="secondary"
                  className="rounded-xl font-semibold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install Now
                </Button>
              ) : (
                <div className="text-xs opacity-80 bg-primary-foreground/10 px-3 py-2 rounded-lg">
                  Menu (⋮) → "Add to Home screen" or "Install app"
                </div>
              )}
              <Button 
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10"
              >
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-primary-foreground/80 hover:text-primary-foreground transition flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
};
