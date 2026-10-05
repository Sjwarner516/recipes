const LIMITS = {
  title: 120,
  author: 80,
  summary: 500,
  cookTime: 40,
  servings: 40,
  ingredient: 200,
  step: 500,
};

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function linesFromText(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function validateRecipe(input: {
  title: string;
  author: string;
  summary: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  steps: string[];
}) {
  if (!input.title) return { field: "title", message: "Give the recipe a title." };
  if (input.title.length > LIMITS.title) {
    return { field: "title", message: "Keep the title under 120 characters." };
  }
  if (!input.author) {
    return { field: "author", message: "Add your name so people know who shared it." };
  }
  if (input.author.length > LIMITS.author) {
    return { field: "author", message: "Keep your name under 80 characters." };
  }
  if (!input.summary) {
    return { field: "summary", message: "Write a short note about the dish." };
  }
  if (input.summary.length > LIMITS.summary) {
    return { field: "summary", message: "Keep the note under 500 characters." };
  }
  if (input.cookTime.length > LIMITS.cookTime) {
    return { field: "cookTime", message: "Keep the time short, like “45 minutes”." };
  }
  if (input.servings.length > LIMITS.servings) {
    return { field: "servings", message: "Keep the servings short, like “4 bowls”." };
  }
  if (input.ingredients.length === 0) {
    return {
      field: "ingredients",
      message: "Add at least one ingredient, each on its own line.",
    };
  }
  if (
    input.ingredients.length > 40 ||
    input.ingredients.some((line) => line.length > LIMITS.ingredient)
  ) {
    return {
      field: "ingredients",
      message: "Use up to 40 ingredients, each under 200 characters.",
    };
  }
  if (input.steps.length === 0) {
    return { field: "steps", message: "Add at least one step, each on its own line." };
  }
  if (input.steps.length > 30 || input.steps.some((line) => line.length > LIMITS.step)) {
    return { field: "steps", message: "Use up to 30 steps, each under 500 characters." };
  }
  return null;
}

export function validatePhoto(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "That photo is too large. Keep it under 5 MB.";
  }
  return null;
}
