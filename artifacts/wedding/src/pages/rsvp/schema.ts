import { z } from "zod";
import { DIETARY_FLAG_VALUES } from "@/config/rsvp";

const dietaryFlagSchema = z.enum(DIETARY_FLAG_VALUES);

export const rsvpSchema = z.object({
  fullName: z.string().min(2, "Inserisci almeno nome e cognome"),
  guestCount: z.number().min(1).max(10),
  childrenCount: z.number().min(0).max(10),
  dietaryFlags: z.array(dietaryFlagSchema).max(3),
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;
