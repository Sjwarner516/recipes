import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { deleteRecipe } from "@/lib/recipes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const removed = await deleteRecipe(id);
  if (!removed) {
    return NextResponse.json(
      { error: "That recipe is already gone." },
      { status: 404 },
    );
  }
  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
  return NextResponse.json({ ok: true });
}
