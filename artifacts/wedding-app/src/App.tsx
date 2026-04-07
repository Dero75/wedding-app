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
import {
  clearAllLocalWeddingRecordsForSupabaseMigration,
  clearLegacyAdminSettingsSnapshot,
} from "@/lib/storage";

const queryClient = new QueryClient();

function LegacyStorageSanitizer() {
  useEffect(() => {
    clearLegacyAdminSettingsSnapshot();
  }, []);
  return null;
}

function DevLocalRecordsResetter() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (import.meta.env.MODE === "test") return;
    const resetMarkerKey = "wedding_local_records_reset_v1";
    if (localStorage.getItem(resetMarkerKey) === "1") return;

    clearAllLocalWeddingRecordsForSupabaseMigration();
    localStorage.setItem(resetMarkerKey, "1");
    window.location.reload();
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
        <LegacyStorageSanitizer />
        <DevLocalRecordsResetter />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
