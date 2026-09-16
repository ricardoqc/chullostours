import { revalidatePath } from "next/cache";

export function revalidateTourPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${slug}`);
  revalidatePath("/destinos");
  revalidatePath("/resultados-de-busqueda");
  revalidatePath("/sitemap.xml");
}

export function revalidateBlogPages(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export function revalidateDestinoPages(slug?: string) {
  revalidatePath("/destinos");
  if (slug) revalidatePath(`/destinos/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}
