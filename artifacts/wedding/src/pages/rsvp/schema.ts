import { z } from "zod";

const dietaryCountsSchema = z.object({
  vegetarian: z.number().int().min(0).max(10),
  vegan: z.number().int().min(0).max(10),
  celiac: z.number().int().min(0).max(10),
});

export const rsvpSchema = z.object({
  firstName: z.string().trim().min(2, "Inserisci il nome"),
  lastName: z.string().trim().min(2, "Inserisci il cognome"),
  guestCount: z.number().min(1).max(10),
  childrenCount: z.number().min(0).max(10),
  dietaryCounts: dietaryCountsSchema,
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;
