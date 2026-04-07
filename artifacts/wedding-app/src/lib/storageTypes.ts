import type { DietaryCounts } from "@/config/rsvp";

export interface EditableContent {
  // Intro
  introTagline: string;
  // Home hero
  heroSubtitle: string;
  weddingTime: string;
  weddingLocation: string;
  weddingAddress: string;
  // Home body
  welcomeTitle: string;
  welcomeText: string;
  ctaRSVP: string;
  ctaDetails: string;
  // Details
  ceremonyPlace: string;
  ceremonyTime: string;
  ceremonyAddress: string;
  ceremonyNote: string;
  receptionPlace: string;
  receptionTime: string;
  receptionAddress: string;
  receptionNote: string;
  detailsGiftTitle: string;
  detailsGiftSubtitle: string;
  detailsGiftButtonLabel: string;
  // Gift
  giftTitle: string;
  giftText: string;
  giftIBAN: string;
  giftBIC: string;
  giftHolder: string;
  // Pass
  passTitle: string;
  passSubtitle: string;
}

export const DEFAULT_CONTENT: EditableContent = {
  introTagline: "il matrimonio di",
  heroSubtitle: "il matrimonio di",
  weddingTime: "16:00",
  weddingLocation: "Villa Borgonuovo",
  weddingAddress: "Via Borgonuovo 12, 40125 Bologna",
  welcomeTitle: "Siete i benvenuti",
  welcomeText:
    "Con immensa gioia vi invitiamo a celebrare con noi il giorno più bello della nostra vita. La vostra presenza renderà questo momento ancora più indimenticabile.",
  ctaRSVP: "Conferma la tua presenza",
  ctaDetails: "Il programma",
  ceremonyPlace: "Villa Borgonuovo — Cappella",
  ceremonyTime: "16:00",
  ceremonyAddress: "Via Borgonuovo 12, 40125 Bologna",
  ceremonyNote: "Vi chiediamo di arrivare 15 minuti prima della cerimonia.",
  receptionPlace: "Villa Borgonuovo — Cortile interno",
  receptionTime: "18:30",
  receptionAddress: "Via Borgonuovo 12, 40125 Bologna",
  receptionNote: "Ci uniamo nel cortile per il ricevimento all'aperto.",
  detailsGiftTitle: "Il regalo più bello sarà condividere con voi questo giorno.",
  detailsGiftSubtitle: "Se desiderate accompagnarci anche con un pensiero, potete farlo qui.",
  detailsGiftButtonLabel: "Contributo IBAN",
  giftTitle: "Un pensiero per noi",
  giftText:
    "La vostra presenza è il regalo più bello che potessimo ricevere. Per chi volesse farci un pensiero, vi lasciamo i nostri riferimenti bancari.",
  giftIBAN: "IT60 X054 2811 1010 0000 0123 456",
  giftBIC: "BLOPIT22",
  giftHolder: "Davide Rossi",
  passTitle: "Il vostro invito",
  passSubtitle: "Lasciate questo pass all'ingresso della villa",
};

export interface RSVPEntry {
  id: string;
  firstName: string;
  lastName: string;
  guestCount: number;
  childrenCount: number;
  dietaryCounts: DietaryCounts;
  submittedAt: string;
}

export type DbContentRow = Record<string, unknown> | null;
export type DbRsvpRow = Record<string, unknown> | null;
