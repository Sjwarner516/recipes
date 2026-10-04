"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-heading text-4xl">The shelf didn’t load</h1>
      <p className="mt-3 text-muted-foreground">
        Something went wrong while reading the recipes. Try again in a moment.
      </p>
      <Button type="button" className="mt-6 h-11 px-5" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
