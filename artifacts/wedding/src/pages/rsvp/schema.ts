import { z } from "zod";

export const rsvpSchema = z.object({
  fullName: z.string().min(2, "Inserisci almeno nome e cognome"),
  attending: z.enum(["yes", "no"], { errorMap: () => ({ message: "Scegli se parteciperai" }) }),
  guestCount: z.number().min(1).max(10),
  dietaryNotes: z.string().optional(),
  message: z.string().optional(),
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;
