import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import { formatIban } from "@/lib/iban";
import { normalizePersonName } from "@/lib/personName";
import { mapDbContentRow, mapDbRsvpRows, toDbContentRow, toDbRsvpRow } from "@/lib/storageMappers";
import { sanitizeRsvpEntry } from "@/lib/storageRsvpSanitizer";
import {
  DEFAULT_CONTENT,
  type EditableContent,
  type DbRsvpRow,
  type RSVPEntry,
} from "@/lib/storageTypes";

const PREFIX = "wedding_";
const STORAGE_KEYS = {
  content: "content",
  rsvps: "rsvps",
  myRsvp: "my_rsvp",
  myRsvpId: "my_rsvp_id",
} as const;
const LEGACY_ADMIN_SETTINGS_KEY = "admin_settings";
const DEV_RESET_MARKER_KEY = "local_records_reset_v1";
const IS_TEST = import.meta.env.MODE === "test";
const USE_DB_SOURCE = !IS_TEST && hasSupabaseConfig && supabase !== null;

let contentCache: EditableContent = DEFAULT_CONTENT;
let rsvpsCache: RSVPEntry[] = [];
let myRsvpCache: RSVPEntry | null = null;
let bootstrapPromise: Promise<void> | null = null;

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function storageRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

function clearLocalWeddingRecords(opts?: { preserveMyRsvpId?: boolean }): void {
  const preserveMyRsvpId = opts?.preserveMyRsvpId ?? false;
  const protectedKeys = new Set<string>(preserveMyRsvpId ? [PREFIX + STORAGE_KEYS.myRsvpId] : []);

  try {
    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(PREFIX) || protectedKeys.has(key)) continue;
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

function readLocalMyRsvpId(): string | null {
  const currentId = storageGet<string | null>(STORAGE_KEYS.myRsvpId, null);
  if (typeof currentId === "string" && currentId.trim()) return currentId;

  const legacy = storageGet<unknown>(STORAGE_KEYS.myRsvp, null);
  if (!legacy || typeof legacy !== "object") return null;
  const id = (legacy as Record<string, unknown>).id;
  return typeof id === "string" && id.trim() ? id : null;
}

async function bootstrapFromDb(): Promise<void> {
  if (!USE_DB_SOURCE) return;

  const existingMyId = readLocalMyRsvpId();
  clearLocalWeddingRecords({ preserveMyRsvpId: true });
  clearLegacyAdminSettingsSnapshot();
  if (existingMyId) {
    storageSet(STORAGE_KEYS.myRsvpId, existingMyId);
  } else {
    storageRemove(STORAGE_KEYS.myRsvpId);
  }

  try {
    const [{ data: contentRow }, { data: rsvpRows }] = await Promise.all([
      supabase!.from("wedding_content").select("*").eq("id", 1).maybeSingle(),
      supabase!.from("rsvps").select("*").order("submitted_at", { ascending: false }),
    ]);

    contentCache = mapDbContentRow(contentRow ?? null);
    rsvpsCache = mapDbRsvpRows((rsvpRows ?? []) as DbRsvpRow[], generateId);
  } catch {
    contentCache = DEFAULT_CONTENT;
    rsvpsCache = [];
  }

  const myId = readLocalMyRsvpId();
  myRsvpCache = myId ? rsvpsCache.find((entry) => entry.id === myId) ?? null : null;
}

function bootstrapFromLocal(): void {
  clearLegacyAdminSettingsSnapshot();

  const savedRaw = storageGet<Record<string, unknown>>(STORAGE_KEYS.content, {});
  const saved: Partial<EditableContent> = {};
  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof EditableContent)[]) {
    const value = savedRaw[key];
    if (typeof value === "string") saved[key] = value;
  }
  if (Object.keys(savedRaw).length !== Object.keys(saved).length) {
    storageSet(STORAGE_KEYS.content, saved);
  }
  contentCache = {
    ...DEFAULT_CONTENT,
    ...saved,
    giftIBAN: formatIban((saved.giftIBAN as string) ?? DEFAULT_CONTENT.giftIBAN),
  };

  const raw = storageGet<unknown[]>(STORAGE_KEYS.rsvps, []);
  let hasLegacyMutation = false;
  rsvpsCache = raw
    .map((value) => {
      const result = sanitizeRsvpEntry(value, generateId);
      if (result.mutated) hasLegacyMutation = true;
      return result.entry;
    })
    .filter((entry): entry is RSVPEntry => entry !== null);
  if (rsvpsCache.length !== raw.length || hasLegacyMutation) {
    storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
  }

  const myRaw = storageGet<unknown>(STORAGE_KEYS.myRsvp, null);
  if (!myRaw) {
    myRsvpCache = null;
    return;
  }

  const { entry, mutated } = sanitizeRsvpEntry(myRaw, generateId);
  if (!entry) {
    storageRemove(STORAGE_KEYS.myRsvp);
    myRsvpCache = null;
    return;
  }
  if (mutated) storageSet(STORAGE_KEYS.myRsvp, entry);
  myRsvpCache = entry;
}

export async function initializeWeddingDataSource(): Promise<void> {
  if (bootstrapPromise) return bootstrapPromise;
  bootstrapPromise = (async () => {
    if (USE_DB_SOURCE) {
      await bootstrapFromDb();
      return;
    }
    bootstrapFromLocal();
  })();
  return bootstrapPromise;
}

export async function refreshRsvpsFromDb(): Promise<void> {
  if (!USE_DB_SOURCE) return;

  try {
    const { data: rsvpRows } = await supabase!
      .from("rsvps")
      .select("*")
      .order("submitted_at", { ascending: false });

    rsvpsCache = mapDbRsvpRows((rsvpRows ?? []) as DbRsvpRow[], generateId);
    const myId = readLocalMyRsvpId();
    myRsvpCache = myId ? rsvpsCache.find((entry) => entry.id === myId) ?? null : null;
  } catch {
    // Keep existing cache on transient realtime refresh failures
  }
}

function ensureBootstrappedSyncFallback(): void {
  if (bootstrapPromise || USE_DB_SOURCE) return;
  bootstrapFromLocal();
}

export function getContent(): EditableContent {
  ensureBootstrappedSyncFallback();
  return contentCache;
}

export function saveContent(content: EditableContent): void {
  const normalizedContent: EditableContent = {
    ...content,
    giftIBAN: formatIban(content.giftIBAN),
  };
  contentCache = normalizedContent;

  if (USE_DB_SOURCE) {
    void supabase!
      .from("wedding_content")
      .upsert(toDbContentRow(normalizedContent), { onConflict: "id" })
      .then(({ error }) => {
        if (!error) return;
        storageSet(STORAGE_KEYS.content, normalizedContent);
        console.error("[storage] saveContent Supabase upsert failed", error.message);
      });
    return;
  }

  storageSet(STORAGE_KEYS.content, normalizedContent);
}

export function clearLegacyAdminSettingsSnapshot(): void {
  storageRemove(LEGACY_ADMIN_SETTINGS_KEY);
}

export function getRSVPs(): RSVPEntry[] {
  ensureBootstrappedSyncFallback();
  return rsvpsCache;
}

export function getMyRSVP(): RSVPEntry | null {
  ensureBootstrappedSyncFallback();
  return myRsvpCache;
}

export function saveMyRSVP(entry: RSVPEntry): void {
  const normalizedEntry: RSVPEntry = {
    ...entry,
    firstName: normalizePersonName(entry.firstName),
    lastName: normalizePersonName(entry.lastName),
  };
  rsvpsCache = (() => {
    const next = [...rsvpsCache];
    const idx = next.findIndex((r) => r.id === normalizedEntry.id);
    if (idx >= 0) next[idx] = normalizedEntry;
    else next.push(normalizedEntry);
    return next;
  })();
  myRsvpCache = normalizedEntry;

  if (USE_DB_SOURCE) {
    storageSet(STORAGE_KEYS.myRsvpId, normalizedEntry.id);
    storageRemove(STORAGE_KEYS.myRsvp);
    void supabase!
      .from("rsvps")
      .upsert(toDbRsvpRow(normalizedEntry), { onConflict: "id" })
      .then(({ error }) => {
        if (!error) return;
        storageSet(STORAGE_KEYS.myRsvp, normalizedEntry);
        storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
        console.error("[storage] saveMyRSVP Supabase upsert failed", error.message);
      });
    return;
  }

  storageSet(STORAGE_KEYS.myRsvp, normalizedEntry);
  storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
}

export async function updateRSVP(entry: RSVPEntry): Promise<void> {
  ensureBootstrappedSyncFallback();

  const normalizedEntry: RSVPEntry = {
    ...entry,
    firstName: normalizePersonName(entry.firstName),
    lastName: normalizePersonName(entry.lastName),
  };
  const previousRsvps = rsvpsCache;
  const previousMyRsvp = myRsvpCache;
  if (!rsvpsCache.some((rsvp) => rsvp.id === normalizedEntry.id)) throw new Error("RSVP not found");

  rsvpsCache = rsvpsCache.map((rsvp) => (rsvp.id === normalizedEntry.id ? normalizedEntry : rsvp));
  if (myRsvpCache?.id === normalizedEntry.id) myRsvpCache = normalizedEntry;

  if (USE_DB_SOURCE) {
    const { error } = await supabase!.from("rsvps").upsert(toDbRsvpRow(normalizedEntry), {
      onConflict: "id",
    });

    if (error) {
      rsvpsCache = previousRsvps;
      myRsvpCache = previousMyRsvp;
      throw new Error(error.message);
    }

    storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
    if (myRsvpCache?.id === normalizedEntry.id) {
      storageSet(STORAGE_KEYS.myRsvpId, normalizedEntry.id);
      storageRemove(STORAGE_KEYS.myRsvp);
    }
    return;
  }

  storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
  if (myRsvpCache?.id === normalizedEntry.id) storageSet(STORAGE_KEYS.myRsvp, normalizedEntry);
}

export async function deleteRSVPById(id: string): Promise<void> {
  ensureBootstrappedSyncFallback();

  const previousRsvps = rsvpsCache;
  const previousMyRsvp = myRsvpCache;
  const isDeletingMyRsvp = myRsvpCache?.id === id;

  rsvpsCache = rsvpsCache.filter((entry) => entry.id !== id);
  if (isDeletingMyRsvp) {
    myRsvpCache = null;
  }

  if (USE_DB_SOURCE) {
    const { error } = await supabase!.from("rsvps").delete().eq("id", id);
    if (error) {
      rsvpsCache = previousRsvps;
      myRsvpCache = previousMyRsvp;
      throw new Error(error.message);
    }

    if (isDeletingMyRsvp) {
      storageRemove(STORAGE_KEYS.myRsvpId);
    }
    storageRemove(STORAGE_KEYS.myRsvp);
    storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
    return;
  }

  if (isDeletingMyRsvp) {
    storageRemove(STORAGE_KEYS.myRsvp);
  }
  storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function clearAllLocalWeddingRecordsForSupabaseMigration(): void {
  clearLocalWeddingRecords();
  storageRemove(DEV_RESET_MARKER_KEY);
  clearLegacyAdminSettingsSnapshot();
}

export type { EditableContent, RSVPEntry } from "@/lib/storageTypes";
