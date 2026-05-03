import { useEffect, useMemo, useState } from "react";
import { Bell, RefreshCcw } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import {
  deleteRSVPById,
  getRSVPs,
  refreshRsvpsFromDb,
  type RSVPEntry,
} from "@/lib/storage";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import AdminRsvpSection from "@/pages/admin/components/AdminRsvpSection";
import AdminStats from "@/pages/admin/components/AdminStats";

export default function Admin() {
  const NOTIFY_LAST_SEEN_KEY = "wedding_admin_rsvp_last_seen_submitted_at";
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());
  const [nameOrder, setNameOrder] = useState<"az" | "za">("az");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "declined">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newRecordsCount, setNewRecordsCount] = useState(0);
  const [lastSeenSubmittedAt, setLastSeenSubmittedAt] = useState<string | null>(null);

  const getLatestSubmittedAt = (entries: RSVPEntry[]): string | null => {
    if (entries.length === 0) return null;
    return entries.reduce<string | null>((latest, entry) => {
      if (!entry.submittedAt) return latest;
      if (!latest) return entry.submittedAt;
      return entry.submittedAt > latest ? entry.submittedAt : latest;
    }, null);
  };

  const markNotificationsAsRead = () => {
    const latest = getLatestSubmittedAt(getRSVPs());
    setLastSeenSubmittedAt(latest);
    setNewRecordsCount(0);
    try {
      if (latest) localStorage.setItem(NOTIFY_LAST_SEEN_KEY, latest);
      else localStorage.removeItem(NOTIFY_LAST_SEEN_KEY);
    } catch {
      // ignore storage failures
    }
  };

  const adultsCount = useMemo(
    () => rsvps.reduce((acc, rsvp) => acc + (rsvp.attending ? rsvp.guestCount : 0), 0),
    [rsvps],
  );
  const under18Count = useMemo(
    () => rsvps.reduce((acc, rsvp) => acc + (rsvp.attending ? rsvp.childrenCount : 0), 0),
    [rsvps],
  );
  const notConfirmedCount = useMemo(
    () => rsvps.reduce((acc, rsvp) => acc + (rsvp.attending ? 0 : 1), 0),
    [rsvps],
  );
  const vegetarianCount = useMemo(
    () => rsvps.reduce((acc, rsvp) => acc + (rsvp.attending ? rsvp.dietaryCounts.vegetarian : 0), 0),
    [rsvps],
  );
  const celiacCount = useMemo(
    () => rsvps.reduce((acc, rsvp) => acc + (rsvp.attending ? rsvp.dietaryCounts.celiac : 0), 0),
    [rsvps],
  );
  const filteredAndSortedRsvps = useMemo(() => {
    const filtered = rsvps.filter((rsvp) => {
      if (statusFilter === "confirmed") return rsvp.attending;
      if (statusFilter === "declined") return !rsvp.attending;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.trim();
      const nameB = `${b.firstName} ${b.lastName}`.trim();
      const comparison = nameA.localeCompare(nameB, "it-IT", { sensitivity: "base" });
      return nameOrder === "az" ? comparison : -comparison;
    });
  }, [rsvps, statusFilter, nameOrder]);

  const handleDeleteRsvp = async (id: string) => {
    await deleteRSVPById(id);
    setRsvps(getRSVPs());
  };

  const handleRefreshRsvps = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await refreshRsvpsFromDb();
      setRsvps(getRSVPs());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const latest = getLatestSubmittedAt(getRSVPs());
    try {
      const stored = localStorage.getItem(NOTIFY_LAST_SEEN_KEY);
      if (stored) {
        setLastSeenSubmittedAt(stored);
      } else {
        setLastSeenSubmittedAt(latest);
        if (latest) localStorage.setItem(NOTIFY_LAST_SEEN_KEY, latest);
      }
    } catch {
      setLastSeenSubmittedAt(latest);
    }
  }, []);

  useEffect(() => {
    if (!lastSeenSubmittedAt) {
      setNewRecordsCount(0);
      return;
    }
    setNewRecordsCount(rsvps.filter((entry) => entry.submittedAt > lastSeenSubmittedAt).length);
  }, [lastSeenSubmittedAt, rsvps]);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;
    const realtimeClient = supabase;

    let active = true;
    const channel = realtimeClient
      .channel("admin-rsvps-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNewRecordsCount((prev) => prev + 1);
          }
          void refreshRsvpsFromDb().then(() => {
            if (active) setRsvps(getRSVPs());
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      void realtimeClient.removeChannel(channel);
    };
  }, []);

  return (
    <Layout
      adminTopbarLeftActions={
        <button
          type="button"
          onClick={markNotificationsAsRead}
          data-testid="button-admin-notifications-topbar"
          aria-label="Segna notifiche come lette"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:text-foreground/80 hover:bg-card"
        >
          <Bell size={19} />
          {newRecordsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] leading-[18px] px-1 text-center">
              {newRecordsCount > 99 ? "99+" : newRecordsCount}
            </span>
          )}
        </button>
      }
      adminTopbarActions={
        <button
          type="button"
          onClick={() => void handleRefreshRsvps()}
          disabled={isRefreshing}
          data-testid="button-admin-refresh-topbar"
          aria-label="Aggiorna adesioni"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:text-foreground/80 hover:bg-card disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCcw size={20} className={isRefreshing ? "animate-spin" : undefined} />
        </button>
      }
    >
      <PageContainer className="box-border h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col pt-5 pb-4">
        <SectionTitle title="Gestione Invitati" />

        <div className="-mt-4">
          <AdminStats
            adultsCount={adultsCount}
            under18Count={under18Count}
            notConfirmedCount={notConfirmedCount}
            vegetarianCount={vegetarianCount}
            celiacCount={celiacCount}
          />
        </div>

        <div className="mb-3.5 flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setNameOrder("az")}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                nameOrder === "az"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              A-Z
            </button>
            <button
              type="button"
              onClick={() => setNameOrder("za")}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                nameOrder === "za"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Z-A
            </button>
          </div>

          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tutti
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("confirmed")}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                statusFilter === "confirmed"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Confermati
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("declined")}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                statusFilter === "declined"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Assenti
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <AdminRsvpSection rsvps={filteredAndSortedRsvps} onDeleteRsvp={handleDeleteRsvp} />
        </div>
      </PageContainer>
    </Layout>
  );
}
