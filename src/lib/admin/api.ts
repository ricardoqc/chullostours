/** Rutas del CMS con slash final (el sitio usa trailingSlash y un 308 vacía el body del POST). */
export function adminApi(path: string) {
  const [pathname, query] = path.split("?");
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return query ? `${withSlash}?${query}` : withSlash;
}
