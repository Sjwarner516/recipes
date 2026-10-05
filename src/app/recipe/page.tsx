import { Suspense } from "react";
import type { Metadata } from "next";
import { RecipeDetail } from "@/components/recipe-detail";

export const metadata: Metadata = {
  title: "Recipe",
  description: "A recipe from the Roud shelf.",
};

export default function RecipePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-14" aria-busy="true">
          <p className="text-sm text-muted-foreground">Setting the table…</p>
        </main>
      }
    >
      <RecipeDetail />
    </Suspense>
  );
}
