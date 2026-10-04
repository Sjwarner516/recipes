import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function RecipeNotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">
        Missing
      </p>
      <h1 className="mt-3 font-heading text-4xl">That recipe isn’t on the shelf</h1>
      <p className="mt-3 text-muted-foreground">
        It may have been removed, or the link is a little off.
      </p>
      <Link
        href="/"
        className={buttonVariants({ className: "mt-6 h-11 px-5" })}
      >
        Back to the shelf
      </Link>
    </main>
  );
}
