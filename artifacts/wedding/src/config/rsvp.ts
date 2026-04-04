export const DIETARY_FLAG_VALUES = ["vegetarian", "vegan", "celiac"] as const;

export type DietaryFlag = (typeof DIETARY_FLAG_VALUES)[number];

export const DIETARY_FLAG_LABELS: Record<DietaryFlag, string> = {
  vegetarian: "Vegetariano",
  vegan: "Vegano",
  celiac: "Celiaco",
};
