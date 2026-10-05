import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/logo.png";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-cocoa text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src={logo}
            alt=""
            className="size-16 shrink-0 rounded-lg bg-black object-cover ring-1 ring-honey/40"
          />
          <span className="min-w-0">
            <span className="block font-heading text-xl leading-tight tracking-tight sm:text-2xl">
              Lynda B&apos;s Recipes
            </span>
            <span className="mt-1 hidden text-xs tracking-wide text-honey sm:block">
              Recipes, still warm
            </span>
          </span>
        </Link>
        <Button
          nativeButton={false}
          render={<Link href="/recipes/new" />}
          className="h-10 px-3.5 sm:h-11 sm:px-4"
        >
          <span className="sm:hidden">Share</span>
          <span className="hidden sm:inline">Share a recipe</span>
        </Button>
      </div>
    </header>
  );
}
