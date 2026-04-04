const PREFIX = "wedding_";

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export interface RSVPEntry {
  id: string;
  fullName: string;
  attending: boolean;
  guestCount: number;
  dietaryNotes: string;
  message: string;
  submittedAt: string;
}

export interface AdminSettings {
  stylePreset: "ivory" | "dark" | "blush";
  showCouplePhoto: boolean;
  showGiftSection: boolean;
  showEntrancePass: boolean;
  sectionTitles: {
    home: string;
    rsvp: string;
    details: string;
    gift: string;
    pass: string;
  };
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  stylePreset: "ivory",
  showCouplePhoto: true,
  showGiftSection: true,
  showEntrancePass: true,
  sectionTitles: {
    home: "Deborah & Davide",
    rsvp: "RSVP",
    details: "Il Programma",
    gift: "Un Pensiero",
    pass: "Il Tuo Invito",
  },
};

export function getRSVPs(): RSVPEntry[] {
  return storageGet<RSVPEntry[]>("rsvps", []);
}

export function saveRSVP(entry: RSVPEntry): void {
  const all = getRSVPs();
  const idx = all.findIndex((r) => r.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  storageSet("rsvps", all);
}

export function deleteRSVP(id: string): void {
  const all = getRSVPs().filter((r) => r.id !== id);
  storageSet("rsvps", all);
}

export function getMyRSVP(): RSVPEntry | null {
  return storageGet<RSVPEntry | null>("my_rsvp", null);
}

export function saveMyRSVP(entry: RSVPEntry): void {
  storageSet("my_rsvp", entry);
  saveRSVP(entry);
}

export function getAdminSettings(): AdminSettings {
  return storageGet<AdminSettings>("admin_settings", DEFAULT_ADMIN_SETTINGS);
}

export function saveAdminSettings(settings: AdminSettings): void {
  storageSet("admin_settings", settings);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
