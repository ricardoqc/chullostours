import { revalidatePath } from "next/cache";

/**
 * El sitio usa `trailingSlash: true`. Hay que invalidar con slash final
 * (y sin él) para que Next limpie la entrada correcta del Full Route Cache.
 */
function bust(path: string) {
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  const withoutSlash = withSlash === "/" ? "/" : withSlash.slice(0, -1);

  revalidatePath(withSlash, "page");
  revalidatePath(withSlash, "layout");
  if (withoutSlash !== withSlash) {
    revalidatePath(withoutSlash, "page");
    revalidatePath(withoutSlash, "layout");
  }
}

export function revalidateTourPages(slug: string) {
  bust("/");
  bust("/tours");
  bust(`/tours/${slug}`);
  bust("/destinos");
  bust("/resultados-de-busqueda");
  bust("/sitemap.xml");
}

export function revalidateBlogPages(slug?: string) {
  bust("/");
  bust("/blog");
  if (slug) bust(`/blog/${slug}`);
  bust("/sitemap.xml");
}

export function revalidateDestinoPages(slug?: string) {
  bust("/destinos");
  if (slug) bust(`/destinos/${slug}`);
  bust("/");
  bust("/sitemap.xml");
}
