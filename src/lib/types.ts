export type Recipe = {
  id: string;
  title: string;
  author: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  servings: string;
  imageUrl: string | null;
  createdAt: string;
};

export type NewRecipe = Omit<Recipe, "id" | "createdAt" | "imageUrl"> & {
  imageUrl?: string | null;
};
