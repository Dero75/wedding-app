import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
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
const USE_DB_SOURCE = !IS_TEST;

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

  if (!hasSupabaseConfig || !supabase) {
    contentCache = DEFAULT_CONTENT;
    rsvpsCache = [];
    myRsvpCache = null;
    return;
  }

  try {
    const [{ data: contentRow }, { data: rsvpRows }] = await Promise.all([
      supabase.from("wedding_content").select("*").eq("id", 1).maybeSingle(),
      supabase.from("rsvps").select("*").order("submitted_at", { ascending: false }),
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
  contentCache = { ...DEFAULT_CONTENT, ...saved };

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

function ensureBootstrappedSyncFallback(): void {
  if (bootstrapPromise || USE_DB_SOURCE) return;
  bootstrapFromLocal();
}

export function getContent(): EditableContent {
  ensureBootstrappedSyncFallback();
  return contentCache;
}

export function saveContent(content: EditableContent): void {
  contentCache = content;

  if (USE_DB_SOURCE && hasSupabaseConfig && supabase) {
    void supabase.from("wedding_content").upsert(toDbContentRow(content), { onConflict: "id" });
    return;
  }

  if (!USE_DB_SOURCE) {
    storageSet(STORAGE_KEYS.content, content);
  }
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
  rsvpsCache = (() => {
    const next = [...rsvpsCache];
    const idx = next.findIndex((r) => r.id === entry.id);
    if (idx >= 0) next[idx] = entry;
    else next.push(entry);
    return next;
  })();
  myRsvpCache = entry;

  if (USE_DB_SOURCE && hasSupabaseConfig && supabase) {
    storageSet(STORAGE_KEYS.myRsvpId, entry.id);
    storageRemove(STORAGE_KEYS.myRsvp);
    void supabase.from("rsvps").upsert(toDbRsvpRow(entry), { onConflict: "id" });
    return;
  }

  if (!USE_DB_SOURCE) {
    storageSet(STORAGE_KEYS.myRsvp, entry);
    storageSet(STORAGE_KEYS.rsvps, rsvpsCache);
  }
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
