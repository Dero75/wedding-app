export const DIETARY_FLAG_VALUES = ["vegetarian", "vegan", "celiac"] as const;

export type DietaryFlag = (typeof DIETARY_FLAG_VALUES)[number];
export type DietaryCounts = Record<DietaryFlag, number>;

export const DIETARY_FLAG_LABELS: Record<DietaryFlag, string> = {
  vegetarian: "Vegetariano",
  vegan: "Vegano",
  celiac: "Celiaco",
};

export function createDefaultDietaryCounts(): DietaryCounts {
  return {
    vegetarian: 0,
    vegan: 0,
    celiac: 0,
  };
}
