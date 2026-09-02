import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TOURS_DIR = path.join(process.cwd(), "data", "tours");

// Optional Admin Secret from env or fallback
const ADMIN_SECRET = process.env.ADMIN_SECRET || "chullos2026";

function getTourFiles() {
  if (!fs.existsSync(TOURS_DIR)) return [];
  return fs.readdirSync(TOURS_DIR).filter((f) => f.endsWith(".json"));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("x-admin-key") || searchParams.get("key");

    // Simple security validation
    if (authHeader !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "No autorizado. Clave administrativa incorrecta." },
        { status: 401 }
      );
    }

    const files = getTourFiles();
    const tours = files.map((file) => {
      const fullPath = path.join(TOURS_DIR, file);
      const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      return {
        file,
        slug: data.slug,
        title: data.titulo || data.name || data.slug,
        duration: data.atributos?.duracion || "1 Día",
        price_usd: data.precio_usd || data.precio_base || 0,
        visible: data.visible !== false,
        image: data.galeria?.[0]?.src || "/img/placeholder.jpg",
        destinations: data.destino_ids || [],
      };
    });

    // Sort alphabetically by title
    tours.sort((a, b) => a.title.localeCompare(b.title, "es"));

    return NextResponse.json({
      success: true,
      total: tours.length,
      published: tours.filter((t) => t.visible).length,
      hidden: tours.filter((t) => !t.visible).length,
      tours,
    });
  } catch (error) {
    console.error("Error fetching admin tours:", error);
    return NextResponse.json(
      { error: "Error al leer el catálogo de tours." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("x-admin-key") || body.key;

    if (authHeader !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "No autorizado. Clave administrativa incorrecta." },
        { status: 401 }
      );
    }

    const { slug, visible } = body;

    if (!slug || typeof visible !== "boolean") {
      return NextResponse.json(
        { error: "Parámetros inválidos. Se requiere 'slug' y 'visible' (booleano)." },
        { status: 400 }
      );
    }

    const files = getTourFiles();
    let updated = false;
    let targetFile = "";
    let tourTitle = "";

    for (const file of files) {
      const fullPath = path.join(TOURS_DIR, file);
      const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

      if (data.slug === slug) {
        data.visible = visible;
        tourTitle = data.titulo || data.name || slug;
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
        updated = true;
        targetFile = file;
        break;
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: `No se encontró ningún tour con el slug '${slug}'.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: visible
        ? `El tour '${tourTitle}' ahora está PUBLICADO y VISIBLE en la web.`
        : `El tour '${tourTitle}' ha sido DESACTIVADO y OCULTO de la web.`,
      slug,
      visible,
      file: targetFile,
    });
  } catch (error) {
    console.error("Error updating tour visibility:", error);
    return NextResponse.json(
      { error: "Error al actualizar la visibilidad del tour." },
      { status: 500 }
    );
  }
}
