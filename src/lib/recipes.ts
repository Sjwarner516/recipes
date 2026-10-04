import { promises as fs } from "fs";
import path from "path";
import type { NewRecipe, Recipe } from "@/lib/types";

const dataFile = path.join(process.cwd(), "data", "recipes.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads");

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll(): Promise<Recipe[]> {
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw) as Recipe[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function writeAll(recipes: Recipe[]) {
  const ordered = [...recipes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  await fs.writeFile(dataFile, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");
}

export async function getRecipes(): Promise<Recipe[]> {
  return enqueue(readAll);
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const recipes = await getRecipes();
  return recipes.find((recipe) => recipe.id === id) ?? null;
}

export async function addRecipe(
  input: NewRecipe & { id: string; imageUrl: string | null },
): Promise<Recipe> {
  const recipe: Recipe = {
    id: input.id,
    title: input.title,
    author: input.author,
    summary: input.summary,
    ingredients: input.ingredients,
    steps: input.steps,
    cookTime: input.cookTime,
    servings: input.servings,
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
  };

  return enqueue(async () => {
    const recipes = await readAll();
    recipes.push(recipe);
    await writeAll(recipes);
    return recipe;
  });
}

export async function deleteRecipe(id: string): Promise<boolean> {
  return enqueue(async () => {
    const recipes = await readAll();
    const existing = recipes.find((recipe) => recipe.id === id);
    if (!existing) return false;
    await writeAll(recipes.filter((recipe) => recipe.id !== id));
    await removeUploadedImage(existing.imageUrl);
    return true;
  });
}

export async function saveRecipeImage(file: File, id: string) {
  const extension = extensionForImage(file);
  if (!extension) {
    throw new Error("Use a JPEG, PNG, WebP, or GIF.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("That photo is too large. Keep it under 5 MB.");
  }

  const filename = `${id}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), bytes);
  return `/uploads/${filename}`;
}

export async function removeUploadedImage(imageUrl: string | null) {
  if (!imageUrl?.startsWith("/uploads/")) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === ".gitkeep") return;
  await fs.rm(path.join(uploadsDir, filename), { force: true });
}

function extensionForImage(file: File) {
  const byType: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return byType[file.type] ?? null;
}

export function linesFromField(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function textField(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
