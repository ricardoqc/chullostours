import { revalidatePath } from "next/cache";

export function revalidateTourPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${slug}`);
  revalidatePath("/destinos");
  revalidatePath("/resultados-de-busqueda");
  revalidatePath("/sitemap.xml");
}
