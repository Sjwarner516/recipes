import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-heading text-4xl">This page isn’t in the kitchen</h1>
      <p className="mt-3 text-muted-foreground">
        Head back to the recipes and pick something warm.
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
