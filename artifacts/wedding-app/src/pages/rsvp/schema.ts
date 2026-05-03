import { z } from "zod";
import { normalizePersonName } from "@/lib/personName";

const dietaryCountsSchema = z.object({
  vegetarian: z.number().int().min(0).max(10),
  celiac: z.number().int().min(0).max(10),
});

export const rsvpSchema = z
  .object({
    firstName: z.string().trim().min(2, "Inserisci il nome").transform(normalizePersonName),
    lastName: z.string().trim().min(2, "Inserisci il cognome").transform(normalizePersonName),
    guestCount: z.number().min(1, "Inserisci almeno 1 adulto").max(10),
    childrenCount: z.number().min(0).max(10),
    dietaryCounts: dietaryCountsSchema,
  })
  .superRefine((data, ctx) => {
    const totalGuests = data.guestCount + data.childrenCount;
    if (data.dietaryCounts.vegetarian > totalGuests) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dietaryCounts", "vegetarian"],
        message: "I vegetariani non possono superare il totale invitati",
      });
    }
    if (data.dietaryCounts.celiac > totalGuests) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dietaryCounts", "celiac"],
        message: "I celiaci non possono superare il totale invitati",
      });
    }
  });

export type RSVPFormData = z.infer<typeof rsvpSchema>;
