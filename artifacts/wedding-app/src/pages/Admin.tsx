import { useEffect, useMemo, useState } from "react";
import { Bell, RefreshCcw } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import {
  deleteRSVPById,
  getRSVPs,
  refreshRsvpsFromDb,
  updateRSVP,
  type RSVPEntry,
} from "@/lib/storage";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import AdminRsvpSection from "@/pages/admin/components/AdminRsvpSection";
import AdminStats from "@/pages/admin/components/AdminStats";

const NOTIFY_SEEN_IDS_KEY = "wedding_admin_rsvp_seen_ids_v2";

function loadSeenIds(): string[] {
  try {
    const raw = localStorage.getItem(NOTIFY_SEEN_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string" && value.length > 0);
  } catch {
    return [];
  }
}

export default function Admin() {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());
  const [nameOrder, setNameOrder] = useState<"az" | "za">("az");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [seenIds, setSeenIds] = useState<string[]>(() => loadSeenIds());

  const persistSeenIds = (ids: string[]) => {
    setSeenIds(ids);
    try {
      localStorage.setItem(NOTIFY_SEEN_IDS_KEY, JSON.stringify(ids));
    } catch {
      // ignore storage failures
    }
  };

  const markNotificationsAsRead = () => {
    const merged = Array.from(new Set([...seenIds, ...rsvps.map((entry) => entry.id)]));
    persistSeenIds(merged);
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
    const query = searchQuery.trim().toLowerCase();
    const filtered = rsvps.filter((rsvp) => {
      if (statusFilter === "confirmed" && !rsvp.attending) return false;
      if (statusFilter === "declined" && rsvp.attending) return false;
      if (query) {
        const fullName = `${rsvp.firstName} ${rsvp.lastName}`.toLowerCase();
        if (!fullName.includes(query)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.trim();
      const nameB = `${b.firstName} ${b.lastName}`.trim();
      const comparison = nameA.localeCompare(nameB, "it-IT", { sensitivity: "base" });
      return nameOrder === "az" ? comparison : -comparison;
    });
  }, [rsvps, statusFilter, nameOrder, searchQuery]);
  const newRecordsCount = useMemo(() => {
    const seenSet = new Set(seenIds);
    return rsvps.filter((entry) => !seenSet.has(entry.id)).length;
  }, [rsvps, seenIds]);

  const handleDeleteRsvp = async (id: string) => {
    await deleteRSVPById(id);
    setRsvps(getRSVPs());
  };

  const handleUpdateRsvp = async (entry: RSVPEntry) => {
    await updateRSVP(entry);
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
    const syncSeenIdsAcrossTabs = (event: StorageEvent) => {
      if (event.key !== NOTIFY_SEEN_IDS_KEY) return;
      setSeenIds(loadSeenIds());
    };

    window.addEventListener("storage", syncSeenIdsAcrossTabs);
    return () => window.removeEventListener("storage", syncSeenIdsAcrossTabs);
  }, []);


  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;
    const realtimeClient = supabase;

    let active = true;
    const channel = realtimeClient
      .channel("admin-rsvps-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        () => {
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

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;

    const syncOnForeground = () => {
      if (document.hidden) return;
      void refreshRsvpsFromDb().then(() => setRsvps(getRSVPs()));
    };

    document.addEventListener("visibilitychange", syncOnForeground);
    window.addEventListener("focus", syncOnForeground);

    return () => {
      document.removeEventListener("visibilitychange", syncOnForeground);
      window.removeEventListener("focus", syncOnForeground);
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
            <span
              data-testid="badge-admin-notifications-count"
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] leading-[18px] px-1 text-center"
            >
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
      <PageContainer className="box-border h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col pt-4 pb-4">
        <div className="[&>div]:mb-4 [&_h2+div]:hidden">
          <SectionTitle title="Gestione Invitati" />
        </div>

        <AdminStats
          adultsCount={adultsCount}
          under18Count={under18Count}
          notConfirmedCount={notConfirmedCount}
          vegetarianCount={vegetarianCount}
          celiacCount={celiacCount}
        />

        <div className="mt-0 mb-2 flex flex-nowrap items-center justify-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cerca"
              aria-label="Cerca invitato per nome o cognome"
              className="w-full rounded-full border border-border bg-card py-2.25 pl-7 pr-7 text-[10px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Cancella ricerca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="inline-flex shrink-0 rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setNameOrder("az")}
              className={`rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                nameOrder === "az"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AZ
            </button>
            <button
              type="button"
              onClick={() => setNameOrder("za")}
              className={`rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                nameOrder === "za"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ZA
            </button>
          </div>

          <div className="inline-flex shrink-0 rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
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
              className={`rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
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
              className={`rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
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
          <AdminRsvpSection
            rsvps={filteredAndSortedRsvps}
            onDeleteRsvp={handleDeleteRsvp}
            onUpdateRsvp={handleUpdateRsvp}
          />
        </div>
      </PageContainer>
    </Layout>
  );
}
