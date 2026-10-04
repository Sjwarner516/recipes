export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12" aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted-foreground">Setting the table…</p>
      <div className="mt-4 h-12 w-2/3 max-w-lg animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10"
          />
        ))}
      </div>
    </div>
  );
}
