"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { useRecipes } from "@/components/recipe-provider";
import { buttonVariants } from "@/components/ui/button";
import { formatPosted } from "@/lib/format";

export function RecipeDetail() {
  const params = useSearchParams();
  const id = params.get("id");
  const { recipes, ready, error } = useRecipes();

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (!ready || !recipes) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14" aria-busy="true">
        <p className="text-sm text-muted-foreground">Setting the table…</p>
        <div className="mt-4 h-12 w-2/3 max-w-lg animate-pulse rounded-lg bg-muted" />
      </main>
    );
  }

  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">
          Missing
        </p>
        <h1 className="mt-3 font-heading text-4xl">That recipe isn’t on the shelf</h1>
        <p className="mt-3 text-muted-foreground">
          It may have been removed, or the link is a little off.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6 h-11 px-5" })}>
          Back to the shelf
        </Link>
      </main>
    );
  }

  const details = [
    recipe.author,
    recipe.cookTime,
    recipe.servings,
    `Shared ${formatPosted(recipe.createdAt)}`,
  ].filter(Boolean);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <Link
        href="/"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to the shelf
      </Link>
      <p className="mt-6 text-sm font-medium tracking-[0.16em] text-primary uppercase">
        Recipe
      </p>
      <h1 className="mt-2 font-heading text-4xl leading-tight text-balance md:text-5xl">
        {recipe.title}
      </h1>
      <p className="mt-3 text-muted-foreground">{details.join(" · ")}</p>
      <p className="mt-5 max-w-2xl text-lg">{recipe.summary}</p>

      {recipe.imageUrl ? (
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          width={1600}
          height={1200}
          unoptimized
          className="mt-8 h-auto max-h-[32rem] w-full rounded-3xl object-cover ring-1 ring-foreground/10"
        />
      ) : (
        <p className="mt-8 rounded-2xl bg-accent/70 px-4 py-3 text-sm text-foreground/80">
          No photo with this one. The method still stands.
        </p>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
          <h2 className="font-heading text-2xl">Ingredients</h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`} className="flex gap-3 text-sm leading-6">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-2xl">Method</h2>
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={`${index}-${step}`} className="flex gap-4">
                <span className="font-heading text-xl text-primary">{index + 1}</span>
                <p className="pt-0.5 leading-7">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <DeleteRecipeButton id={recipe.id} />
      </div>
    </article>
  );
}
