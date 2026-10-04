"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Recipe } from "@/lib/types";

export function RecipeBoard({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return recipes;
    return recipes.filter((recipe) => {
      const haystack = [
        recipe.title,
        recipe.author,
        recipe.summary,
        recipe.cookTime,
        ...recipe.ingredients,
        ...recipe.steps,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, recipes]);

  if (recipes.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-dashed border-primary/30 bg-card px-6 py-14 text-center">
          <h2 className="font-heading text-3xl">The shelf is clear</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Be the first to write one down. A photo can come with it, or not.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/recipes/new" />}
            className="mt-6 h-11 px-5"
          >
            Share a recipe
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, cooks, or ingredients"
          aria-label="Search recipes"
          className="h-11 bg-card pl-9 text-base md:text-base"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-foreground/10">
          <h2 className="font-heading text-2xl">Nothing matches that</h2>
          <p className="mt-2 text-muted-foreground">
            Try a shorter word, or clear the search and browse the shelf.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-10 bg-card px-4"
            onClick={() => setQuery("")}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
