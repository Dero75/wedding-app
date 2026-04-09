import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Share, X } from "lucide-react";
import { useLocation } from "wouter";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "wedding_install_prompt_dismissed";

function isStandaloneMode() {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

export default function InstallAppPrompt() {
  const [location] = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const isIosDevice = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIosHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const isAdminRoute = location.startsWith("/admin");
  const shouldShow = !isAdminRoute && !dismissed && !isInstalled && (Boolean(deferredPrompt) || isIosDevice);

  if (!shouldShow) {
    return null;
  }

  const dismissPrompt = () => {
    setDismissed(true);
    setShowIosHelp(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
        }
      } finally {
        setDeferredPrompt(null);
      }
      return;
    }

    setShowIosHelp((current) => !current);
  };

  return (
    <div className="fixed left-1/2 z-[75] -translate-x-1/2" style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      {showIosHelp && (
        <div className="mb-2.5 w-[min(92vw,24rem)] rounded-2xl border border-border bg-card/95 p-3.5 text-sm text-foreground shadow-lg backdrop-blur-sm">
          <p className="font-serif text-[1.1rem] leading-tight">Installa su iPhone</p>
          <p className="mt-1 text-[0.82rem] text-muted-foreground">
            In Safari/Chrome tocca <Share size={13} className="inline-block align-[-2px]" /> o menu browser e scegli
            {" "}
            <span className="font-medium text-foreground">Aggiungi alla schermata Home</span>
            {" "}
            <Plus size={13} className="inline-block align-[-2px]" />.
          </p>
        </div>
      )}

      <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/95 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={() => void installApp()}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-95"
          data-testid="button-install-app"
        >
          <Download size={13} />
          {deferredPrompt ? "Installa app" : "Aggiungi app"}
        </button>

        <button
          type="button"
          onClick={dismissPrompt}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Chiudi suggerimento installazione app"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
