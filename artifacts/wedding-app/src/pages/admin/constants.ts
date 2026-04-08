import type { EditableContent } from "@/lib/storage";

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
    title: "Benvenuto",
    fields: [
      { key: "welcomeTitle", label: "Titolo" },
      { key: "welcomeText", label: "Sottotitolo", multiline: true },
    ],
  },
  {
    title: "Bottoni Home",
    fields: [
      { key: "ctaRSVP", label: "Bottone RSVP" },
      { key: "ctaDetails", label: "Bottone programma" },
    ],
  },
  {
    title: "Cerimonia",
    fields: [
      { key: "ceremonyTime", label: "Ora cerimonia" },
      { key: "ceremonyPlace", label: "Luogo cerimonia" },
      { key: "ceremonyAddress", label: "Indirizzo cerimonia" },
      { key: "ceremonyNote", label: "Note cerimonia" },
    ],
  },
  {
    title: "Ricevimento",
    fields: [
      { key: "receptionTime", label: "Ora ricevimento" },
      { key: "receptionPlace", label: "Luogo ricevimento" },
      { key: "receptionAddress", label: "Indirizzo ricevimento" },
      { key: "receptionNote", label: "Note ricevimento" },
    ],
  },
  {
    title: "Outfit",
    fields: [
      { key: "outfitTitle", label: "Titolo" },
      { key: "outfitText", label: "Testo", multiline: true },
    ],
  },
  {
    title: "Regalo - Box Programma",
    fields: [
      { key: "detailsGiftTitle", label: "Titolo", multiline: true },
      { key: "detailsGiftSubtitle", label: "Sottotitolo", multiline: true },
      { key: "detailsGiftButtonLabel", label: "Testo pulsante" },
    ],
  },
  {
    title: "Regalo - Sezione",
    fields: [
      { key: "giftTitle", label: "Titolo sezione" },
      { key: "giftIBAN", label: "IBAN" },
      { key: "giftHolder", label: "Intestatario" },
    ],
  },
];
