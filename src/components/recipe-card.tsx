import Image from "next/image";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPosted } from "@/lib/format";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipe?id=${recipe.id}`}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full pt-0 transition duration-200 group-hover:-translate-y-0.5 group-hover:ring-primary/30">
        {recipe.imageUrl ? (
          <div className="relative aspect-[4/3]">
            <Image
              src={recipe.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PhotoPlaceholder />
        )}
        <CardHeader className="gap-2">
          <CardTitle className="font-heading text-xl leading-snug">
            {recipe.title}
          </CardTitle>
          <CardDescription>
            {recipe.author}
            {recipe.cookTime ? ` · ${recipe.cookTime}` : ""}
          </CardDescription>
          <p className="line-clamp-2 text-sm text-foreground/80">
            {recipe.summary}
          </p>
          <p className="text-xs text-muted-foreground">
            Shared {formatPosted(recipe.createdAt)}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
