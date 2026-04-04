import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
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
import { ensureDevTestRsvps, getAdminSettings } from "@/lib/storage";

const queryClient = new QueryClient();

function PresetApplier() {
  useEffect(() => {
    const applyPreset = () => {
      const { stylePreset } = getAdminSettings();
      document.documentElement.dataset.preset = stylePreset;
    };
    applyPreset();
    const handler = () => applyPreset();
    window.addEventListener("storage", handler);
    window.addEventListener("preset-changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("preset-changed", handler);
    };
  }, []);
  return null;
}

function DevDataSeeder() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    ensureDevTestRsvps(50);
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PresetApplier />
        <DevDataSeeder />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
