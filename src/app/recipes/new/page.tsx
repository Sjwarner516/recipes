import type { Metadata } from "next";
import Link from "next/link";
import { RecipeForm } from "@/components/recipe-form";

export const metadata: Metadata = {
  title: "Share a recipe",
  description: "Add a recipe to Lynda B's Recipes, with a photo if you want one.",
};

export default function NewRecipePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link
        href="/"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to the shelf
      </Link>
      <h1 className="mt-4 font-heading text-4xl md:text-5xl">Share a recipe</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Title, a few lines about it, the ingredients, and the method. The photo
        can wait, or skip it entirely. What you save stays in this browser.
      </p>
      <div className="mt-8 rounded-3xl bg-card/80 p-4 ring-1 ring-foreground/10 sm:p-6">
        <RecipeForm />
      </div>
    </main>
  );
}
