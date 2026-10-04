import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  addRecipe,
  linesFromField,
  removeUploadedImage,
  saveRecipeImage,
  textField,
} from "@/lib/recipes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = {
  title: 120,
  author: 80,
  summary: 500,
  cookTime: 40,
  servings: 40,
  ingredient: 200,
  step: 500,
};

export async function POST(request: Request) {
  let imageUrl: string | null = null;

  try {
    const form = await request.formData();
    const title = textField(form.get("title"));
    const author = textField(form.get("author"));
    const summary = textField(form.get("summary"));
    const cookTime = textField(form.get("cookTime"));
    const servings = textField(form.get("servings"));
    const ingredients = linesFromField(form.get("ingredients"));
    const steps = linesFromField(form.get("steps"));

    const error = validate({
      title,
      author,
      summary,
      cookTime,
      servings,
      ingredients,
      steps,
    });
    if (error) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 400 });
    }

    const image = form.get("image");
    const id = randomUUID();
    if (image instanceof File && image.size > 0) {
      imageUrl = await saveRecipeImage(image, id);
    }

    const recipe = await addRecipe({
      id,
      title,
      author,
      summary,
      cookTime,
      servings,
      ingredients,
      steps,
      imageUrl,
    });

    revalidatePath("/");
    revalidatePath(`/recipes/${recipe.id}`);
    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    if (imageUrl) await removeUploadedImage(imageUrl);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("too large") || message.includes("JPEG")) {
      return NextResponse.json(
        { error: message, field: "image" },
        { status: message.includes("too large") ? 413 : 415 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Could not save that recipe. Try again." },
      { status: 500 },
    );
  }
}

function validate(input: {
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
  if (input.ingredients.length > 40 || input.ingredients.some((line) => line.length > LIMITS.ingredient)) {
    return {
      field: "ingredients",
      message: "Use up to 40 ingredients, each under 200 characters.",
    };
  }
  if (input.steps.length === 0) {
    return {
      field: "steps",
      message: "Add at least one step, each on its own line.",
    };
  }
  if (input.steps.length > 30 || input.steps.some((line) => line.length > LIMITS.step)) {
    return {
      field: "steps",
      message: "Use up to 30 steps, each under 500 characters.",
    };
  }
  return null;
}
