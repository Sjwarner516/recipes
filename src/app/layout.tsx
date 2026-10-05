import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { RecipeProvider } from "@/components/recipe-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Roud",
    template: "%s · Roud",
  },
  description:
    "Share a recipe and a photo, if you have one. A warm kitchen for dishes worth passing on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <RecipeProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </RecipeProvider>
      </body>
    </html>
  );
}
