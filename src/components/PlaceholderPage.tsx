import Link from 'next/link';

interface StaticPageProps {
  title: string;
  category: string;
  description: string;
}

export function PlaceholderPage({ title, category, description }: StaticPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            {category}
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">{title}</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">{description}</p>
        <div className="pt-6 border-t border-slate-100 flex gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            ← Volver al Inicio
          </Link>
          <Link
            href="/tours/"
            className="text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            Ver catálogo de Tours →
          </Link>
        </div>
      </div>
    </main>
  );
}
