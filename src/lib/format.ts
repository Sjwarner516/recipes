export function formatPosted(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function recipeCountLabel(count: number) {
  if (count === 0) return "The shelf is empty";
  if (count === 1) return "1 recipe on the shelf";
  return `${count} recipes on the shelf`;
}
