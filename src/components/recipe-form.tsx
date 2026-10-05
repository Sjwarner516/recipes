"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { useRecipes } from "@/components/recipe-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { linesFromText, validateRecipe } from "@/lib/validate";

const fieldClass = "h-11 bg-card px-3 text-base md:text-base";

export function RecipeForm() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [field, setField] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function clearImage() {
    if (fileInput.current) fileInput.current.value = "";
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError(null);
    setField(null);

    try {
      const data = new FormData(form);
      const title = String(data.get("title") ?? "").trim();
      const author = String(data.get("author") ?? "").trim();
      const summary = String(data.get("summary") ?? "").trim();
      const cookTime = String(data.get("cookTime") ?? "").trim();
      const servings = String(data.get("servings") ?? "").trim();
      const ingredients = linesFromText(String(data.get("ingredients") ?? ""));
      const steps = linesFromText(String(data.get("steps") ?? ""));
      const problem = validateRecipe({
        title,
        author,
        summary,
        cookTime,
        servings,
        ingredients,
        steps,
      });
      if (problem) {
        setError(problem.message);
        setField(problem.field);
        return;
      }
      const image = fileInput.current?.files?.[0] ?? null;
      const id = await addRecipe(
        { title, author, summary, cookTime, servings, ingredients, steps },
        image && image.size > 0 ? image : null,
      );
      router.push(`/recipe?id=${id}`);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not save that recipe. Try again.",
      );
      setField("image");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder="Brown butter cinnamon rolls"
            aria-invalid={field === "title"}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Your name</Label>
          <Input
            id="author"
            name="author"
            required
            maxLength={80}
            placeholder="How should we credit you?"
            aria-invalid={field === "author"}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cookTime">Time</Label>
          <Input
            id="cookTime"
            name="cookTime"
            maxLength={40}
            placeholder="45 minutes"
            aria-invalid={field === "cookTime"}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="servings">Servings</Label>
          <Input
            id="servings"
            name="servings"
            maxLength={40}
            placeholder="4 bowls"
            aria-invalid={field === "servings"}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="summary">A short note</Label>
          <Textarea
            id="summary"
            name="summary"
            required
            maxLength={500}
            placeholder="A sentence or two about how it tastes, or when you make it."
            aria-invalid={field === "summary"}
            className="min-h-24 bg-card px-3 text-base md:text-base"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            required
            placeholder={"1 cup warm milk\n2 teaspoons yeast\nA pinch of salt"}
            aria-invalid={field === "ingredients"}
            className="min-h-36 bg-card px-3 text-base md:text-base"
          />
          <p className="text-xs text-muted-foreground">One ingredient on each line.</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="steps">Method</Label>
          <Textarea
            id="steps"
            name="steps"
            required
            placeholder={"Warm the milk until it feels like bath water.\nStir in the yeast and wait until it foams."}
            aria-invalid={field === "steps"}
            className="min-h-40 bg-card px-3 text-base md:text-base"
          />
          <p className="text-xs text-muted-foreground">One step on each line.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Photo</Label>
        <div className="rounded-2xl border border-dashed border-primary/35 bg-card p-4">
          {preview ? (
            <Image
              src={preview}
              alt="Selected recipe photo"
              width={1200}
              height={800}
              unoptimized
              className="mb-4 h-auto max-h-72 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mb-4 flex items-center gap-3 text-muted-foreground">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <ImagePlus className="size-5" />
              </span>
              <p className="text-sm">
                Add a photo if you want. The recipe is fine without one.
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Input
              ref={fileInput}
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onImageChange}
              aria-invalid={field === "image"}
              className="h-11 max-w-sm bg-background text-sm file:mr-3 file:text-foreground"
            />
            {preview ? (
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-card px-4"
                onClick={clearImage}
              >
                Remove photo
              </Button>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Optional. JPEG, PNG, WebP, or GIF, up to 5 MB.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending} className="h-11 px-5">
          {pending ? "Saving recipe…" : "Save recipe"}
        </Button>
        <p className="text-sm text-muted-foreground">
          {pending
          ? "Tucking it onto the shelf."
          : "Saved in this browser, on this computer."}
        </p>
      </div>
    </form>
  );
}
