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
      { key: "ceremonyTime", label: "Ora cerimonia" },
      { key: "ceremonyPlace", label: "Luogo cerimonia" },
      { key: "ceremonyAddress", label: "Indirizzo cerimonia" },
      { key: "ceremonyNote", label: "Note cerimonia" },
      { key: "receptionTime", label: "Ora ricevimento" },
      { key: "receptionPlace", label: "Luogo ricevimento" },
      { key: "receptionAddress", label: "Indirizzo ricevimento" },
      { key: "receptionNote", label: "Note ricevimento" },
      { key: "outfitTitle", label: "Titolo box outfit" },
      { key: "outfitText", label: "Testo box outfit", multiline: true },
    ],
  },
  {
    title: "Regalo",
    fields: [
      { key: "detailsGiftTitle", label: "Titolo box programma", multiline: true },
      { key: "detailsGiftSubtitle", label: "Sottotitolo box programma", multiline: true },
      { key: "detailsGiftButtonLabel", label: "Testo pulsante box programma" },
      { key: "giftTitle", label: "Titolo sezione" },
      { key: "giftIBAN", label: "IBAN" },
      { key: "giftHolder", label: "Intestatario" },
    ],
  },
];
