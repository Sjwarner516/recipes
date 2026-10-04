import Link from "next/link";
import { RecipeBoard } from "@/components/recipe-board";
import { buttonVariants } from "@/components/ui/button";
import { recipeCountLabel } from "@/lib/format";
import { getRecipes } from "@/lib/recipes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recipes = await getRecipes();

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
            {recipeCountLabel(recipes.length)}
          </p>
        </div>
      </section>
      <RecipeBoard recipes={recipes} />
    </>
  );
}
