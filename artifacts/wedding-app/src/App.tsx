import { useEffect, useRef, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Intro from "@/pages/Intro";
import Home from "@/pages/Home";
import RSVP from "@/pages/RSVP";
import Details from "@/pages/Details";
import Gift from "@/pages/Gift";
import EntrancePass from "@/pages/EntrancePass";
import Admin from "@/pages/Admin";
import AdminSettings from "@/pages/AdminSettings";
import {
  clearLegacyAdminSettingsSnapshot,
  initializeWeddingDataSource,
} from "@/lib/storage";

const queryClient = new QueryClient();

function LegacyStorageSanitizer() {
  useEffect(() => {
    clearLegacyAdminSettingsSnapshot();
  }, []);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/home" component={Home} />
      <Route path="/rsvp" component={RSVP} />
      <Route path="/details" component={Details} />
      <Route path="/gift" component={Gift} />
      <Route path="/pass" component={EntrancePass} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function BackgroundMusicPlayer() {
  if (import.meta.env.MODE === "test") {
    return null;
  }

  const [location] = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const locationRef = useRef(location);
  const src = `${import.meta.env.BASE_URL}audio/piano.mp3`;

  const isPlayableRoute = (path: string) => !path.startsWith("/admin");

  const safePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const maybePromise = audio.play();
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => undefined);
      }
    } catch {
      // Ignore browser autoplay policy errors.
    }
  };

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;

    const unlockAndPlay = () => {
      unlockedRef.current = true;
      if (!document.hidden && isPlayableRoute(locationRef.current)) {
        safePlay();
      }
    };

    const pointerOptions: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("pointerdown", unlockAndPlay, pointerOptions);
    window.addEventListener("touchstart", unlockAndPlay, pointerOptions);
    window.addEventListener("click", unlockAndPlay, pointerOptions);
    window.addEventListener("keydown", unlockAndPlay, { once: true });
    safePlay();

    return () => {
      window.removeEventListener("pointerdown", unlockAndPlay);
      window.removeEventListener("touchstart", unlockAndPlay);
      window.removeEventListener("click", unlockAndPlay);
      window.removeEventListener("keydown", unlockAndPlay);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (location.startsWith("/admin") || document.hidden) {
      audio.pause();
      return;
    }
    if (unlockedRef.current) {
      safePlay();
    }
  }, [location]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
        return;
      }
      if (unlockedRef.current && isPlayableRoute(locationRef.current)) {
        safePlay();
      }
    };

    const handlePageHide = () => {
      audio.pause();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return <audio ref={audioRef} src={src} loop preload="metadata" playsInline aria-hidden="true" />;
}

function DataSourceBootstrapper({ children }: { children: React.ReactNode }) {
  const isTestMode = import.meta.env.MODE === "test";
  const [ready, setReady] = useState(isTestMode);

  useEffect(() => {
    if (isTestMode) return;
    let active = true;
    void initializeWeddingDataSource().finally(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [isTestMode]);

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LegacyStorageSanitizer />
        <DataSourceBootstrapper>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <BackgroundMusicPlayer />
            <Router />
          </WouterRouter>
        </DataSourceBootstrapper>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
