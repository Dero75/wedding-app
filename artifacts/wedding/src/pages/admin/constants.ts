import type { AdminSettings, EditableContent } from "@/lib/storage";

export const STYLE_PRESETS = ["ivory", "blush", "dark"] as const;

export const PRESET_LABELS: Record<AdminSettings["stylePreset"], string> = {
  ivory: "Avorio Classico",
  blush: "Rosa Romantico",
  dark: "Serale Elegante",
};

export const PRESET_COLORS: Record<AdminSettings["stylePreset"], string> = {
  ivory: "#FAF5EE",
  blush: "#FDF0F2",
  dark: "#1C1410",
};

export const VISIBILITY_ITEMS = [
  { key: "showWelcomeSection", label: "Sezione benvenuto" },
  { key: "showCouplePhoto", label: "Foto coppia (hero)" },
  { key: "showGiftSection", label: "Sezione regalo" },
  { key: "showEntrancePass", label: "Invito digitale" },
] as const;

export type VisibilityKey = (typeof VISIBILITY_ITEMS)[number]["key"];

type ContentField = {
  key: keyof EditableContent;
  label: string;
  multiline?: boolean;
};

type ContentSection = {
  title: string;
  fields: ContentField[];
};

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    title: "Home",
    fields: [
      { key: "brideName", label: "Nome sposa" },
      { key: "groomName", label: "Nome sposo" },
      { key: "weddingTime", label: "Ora cerimonia" },
      { key: "weddingLocation", label: "Luogo" },
      { key: "weddingAddress", label: "Indirizzo" },
      { key: "hashtag", label: "Hashtag" },
      { key: "welcomeTitle", label: "Titolo benvenuto" },
      { key: "welcomeText", label: "Testo benvenuto", multiline: true },
      { key: "ctaRSVP", label: "Bottone RSVP" },
      { key: "ctaDetails", label: "Bottone programma" },
    ],
  },
  {
    title: "Programma",
    fields: [
      { key: "ceremonyPlace", label: "Luogo cerimonia" },
      { key: "ceremonyTime", label: "Ora cerimonia" },
      { key: "ceremonyNote", label: "Note cerimonia" },
      { key: "receptionPlace", label: "Luogo ricevimento" },
      { key: "receptionTime", label: "Ora ricevimento" },
      { key: "receptionNote", label: "Note ricevimento" },
    ],
  },
  {
    title: "Regalo",
    fields: [
      { key: "giftTitle", label: "Titolo sezione" },
      { key: "giftText", label: "Testo", multiline: true },
      { key: "giftIBAN", label: "IBAN" },
      { key: "giftBIC", label: "BIC / SWIFT" },
      { key: "giftHolder", label: "Intestatario" },
    ],
  },
  {
    title: "Invito digitale",
    fields: [
      { key: "passTitle", label: "Titolo pass" },
      { key: "passSubtitle", label: "Sottotitolo pass" },
    ],
  },
];
