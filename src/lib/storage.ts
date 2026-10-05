import seedData from "../../data/recipes.json";
import type { Recipe } from "@/lib/types";

const RECIPES_KEY = "roud.recipes.v1";
const DB_NAME = "roud";
const DB_STORE = "photos";

export type StoredRecipe = Omit<Recipe, "imageUrl"> & { hasImage: boolean };

const seed: StoredRecipe[] = (seedData as Recipe[]).map((recipe) => ({
  id: recipe.id,
  title: recipe.title,
  author: recipe.author,
  summary: recipe.summary,
  ingredients: recipe.ingredients,
  steps: recipe.steps,
  cookTime: recipe.cookTime,
  servings: recipe.servings,
  createdAt: recipe.createdAt,
  hasImage: false,
}));

export function readStoredRecipes(): StoredRecipe[] {
  const raw = localStorage.getItem(RECIPES_KEY);
  if (!raw) {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(seed));
    return seed;
  }
  const parsed = JSON.parse(raw) as StoredRecipe[];
  return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function writeStoredRecipes(recipes: StoredRecipe[]) {
  const ordered = [...recipes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  localStorage.setItem(RECIPES_KEY, JSON.stringify(ordered));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) {
        request.result.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhoto(id: string, file: Blob) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadPhoto(id: string): Promise<Blob | null> {
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const request = tx.objectStore(DB_STORE).get(id);
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob;
}

export async function deletePhoto(id: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function hydrateRecipes(stored: StoredRecipe[]): Promise<Recipe[]> {
  const recipes: Recipe[] = [];
  for (const recipe of stored) {
    let imageUrl: string | null = null;
    if (recipe.hasImage) {
      const blob = await loadPhoto(recipe.id);
      if (blob) imageUrl = URL.createObjectURL(blob);
    }
    recipes.push({
      id: recipe.id,
      title: recipe.title,
      author: recipe.author,
      summary: recipe.summary,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      createdAt: recipe.createdAt,
      imageUrl,
    });
  }
  return recipes;
}
