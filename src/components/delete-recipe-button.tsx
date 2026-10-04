"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteRecipeButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not remove that recipe.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("The kitchen lost the connection. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">Take this recipe off the shelf?</p>
          <Button
            type="button"
            variant="destructive"
            className="h-9 px-3"
            disabled={pending}
            onClick={remove}
          >
            {pending ? "Removing…" : "Yes, remove it"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 bg-card px-3"
            disabled={pending}
            onClick={() => setConfirming(false)}
          >
            Keep it
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-9 bg-card px-3"
          onClick={() => setConfirming(true)}
        >
          Remove this recipe
        </Button>
      )}
    </div>
  );
}
