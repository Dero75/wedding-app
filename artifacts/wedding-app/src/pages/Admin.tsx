import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
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
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());
  const [nameOrder, setNameOrder] = useState<"az" | "za">("az");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "declined">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <Layout
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
      <PageContainer className="h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col pt-8 pb-4">
        <SectionTitle title="Gestione Invitati" />

        <AdminStats
          adultsCount={adultsCount}
          under18Count={under18Count}
          notConfirmedCount={notConfirmedCount}
          vegetarianCount={vegetarianCount}
          celiacCount={celiacCount}
        />

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
