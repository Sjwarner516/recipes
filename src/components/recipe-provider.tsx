"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  deletePhoto,
  hydrateRecipes,
  readStoredRecipes,
  savePhoto,
  writeStoredRecipes,
  type StoredRecipe,
} from "@/lib/storage";
import type { Recipe } from "@/lib/types";
import { validatePhoto } from "@/lib/validate";

type NewRecipeInput = {
  title: string;
  author: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  servings: string;
};

type RecipeContextValue = {
  recipes: Recipe[] | null;
  ready: boolean;
  error: string | null;
  addRecipe: (input: NewRecipeInput, image: File | null) => Promise<string>;
  removeRecipe: (id: string) => Promise<void>;
};

const RecipeContext = createContext<RecipeContextValue | null>(null);

function releaseUrls(recipes: Recipe[]) {
  for (const recipe of recipes) {
    if (recipe.imageUrl?.startsWith("blob:")) URL.revokeObjectURL(recipe.imageUrl);
  }
}

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const created: Recipe[] = [];
    (async () => {
      try {
        const hydrated = await hydrateRecipes(readStoredRecipes());
        created.push(...hydrated);
        if (cancelled) {
          releaseUrls(hydrated);
          return;
        }
        setRecipes(hydrated);
      } catch {
        if (!cancelled) {
          setError("The shelf didn’t open. Refresh the page and try again.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<RecipeContextValue>(
    () => ({
      recipes,
      ready: recipes !== null || error !== null,
      error,
      async addRecipe(input, image) {
        if (image) {
          const photoError = validatePhoto(image);
          if (photoError) throw new Error(photoError);
        }
        const id = crypto.randomUUID();
        const stored: StoredRecipe = {
          id,
          title: input.title,
          author: input.author,
          summary: input.summary,
          ingredients: input.ingredients,
          steps: input.steps,
          cookTime: input.cookTime,
          servings: input.servings,
          createdAt: new Date().toISOString(),
          hasImage: Boolean(image),
        };
        if (image) await savePhoto(id, image);
        const current = readStoredRecipes();
        writeStoredRecipes([stored, ...current]);
        const imageUrl = image ? URL.createObjectURL(image) : null;
        setRecipes((existing) => [
          { ...stored, imageUrl },
          ...(existing ?? []),
        ]);
        return id;
      },
      async removeRecipe(id) {
        const current = readStoredRecipes();
        const target = current.find((recipe) => recipe.id === id);
        if (!target) throw new Error("That recipe is already gone.");
        writeStoredRecipes(current.filter((recipe) => recipe.id !== id));
        if (target.hasImage) await deletePhoto(id);
        setRecipes((existing) => {
          const removed = existing?.find((recipe) => recipe.id === id);
          if (removed?.imageUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(removed.imageUrl);
          }
          return (existing ?? []).filter((recipe) => recipe.id !== id);
        });
      },
    }),
    [recipes, error],
  );

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipes must be used inside RecipeProvider");
  return context;
}
