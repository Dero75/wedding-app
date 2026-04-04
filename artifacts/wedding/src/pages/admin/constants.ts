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
    title: "Home",
    fields: [
      { key: "weddingTime", label: "Ora cerimonia" },
      { key: "weddingLocation", label: "Luogo" },
      { key: "weddingAddress", label: "Indirizzo" },
    ],
  },
  {
    title: "Benvenuto",
    fields: [
      { key: "welcomeTitle", label: "Titolo benvenuto" },
      { key: "welcomeText", label: "Testo benvenuto", multiline: true },
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
    title: "Invito / Pass",
    fields: [
      { key: "passTitle", label: "Titolo pass" },
      { key: "passSubtitle", label: "Sottotitolo pass" },
    ],
  },
];
