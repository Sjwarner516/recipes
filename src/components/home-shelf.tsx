"use client";

import Link from "next/link";
import { RecipeBoard } from "@/components/recipe-board";
import { useRecipes } from "@/components/recipe-provider";
import { buttonVariants } from "@/components/ui/button";
import { recipeCountLabel } from "@/lib/format";

export function HomeShelf() {
  const { recipes, ready, error } = useRecipes();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-16 md:pb-10">
        <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
          The shelf
        </p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-[1.05] text-balance md:text-6xl">
          Bring something warm to the table.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Write a recipe the way you’d tell it at the counter. Add a photo if
          you have one — the dish can stand on its own.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/recipes/new"
            className={buttonVariants({ className: "h-11 px-5 text-base" })}
          >
            Share a recipe
          </Link>
          <p className="text-sm text-muted-foreground">
            {error
              ? "The shelf didn’t open"
              : ready && recipes
                ? recipeCountLabel(recipes.length)
                : "Setting the table…"}
          </p>
        </div>
      </section>
      {error ? (
        <p role="alert" className="mx-auto max-w-6xl px-4 pb-16 text-destructive">
          {error}
        </p>
      ) : ready && recipes ? (
        <RecipeBoard recipes={recipes} />
      ) : (
        <div className="mx-auto max-w-6xl px-4 pb-16" aria-busy="true">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
