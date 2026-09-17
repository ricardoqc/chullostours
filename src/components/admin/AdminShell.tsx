"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, FileText, Images, Inbox, Map } from "lucide-react";

type AdminShellProps = {
  children: React.ReactNode;
  wide?: boolean;
};

export function AdminShell({ children, wide = false }: AdminShellProps) {
  const pathname = usePathname();
  const toursActive = pathname.startsWith("/admin/tours");
  const destinosActive = pathname.startsWith("/admin/destinos");
  const blogActive = pathname.startsWith("/admin/blog");
  const mediaActive = pathname.startsWith("/admin/media");
  const leadsActive = pathname.startsWith("/admin/leads");

  const linkClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 min-h-11 px-3 rounded-xl text-xs font-bold border ${
      active
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className={`${wide ? "max-w-7xl" : "max-w-5xl"} mx-auto flex flex-col gap-6`}>
        <nav aria-label="CMS" className="flex flex-wrap items-center gap-2">
          <Link href="/admin/tours/" className={linkClass(toursActive)}>
            <Map className="w-4 h-4" aria-hidden="true" />
            Tours
          </Link>
          <Link href="/admin/destinos/" className={linkClass(destinosActive)}>
            <Compass className="w-4 h-4" aria-hidden="true" />
            Destinos
          </Link>
          <Link href="/admin/blog/" className={linkClass(blogActive)}>
            <FileText className="w-4 h-4" aria-hidden="true" />
            Blog
          </Link>
          <Link href="/admin/media/" className={linkClass(mediaActive)}>
            <Images className="w-4 h-4" aria-hidden="true" />
            Mediateca
          </Link>
          <Link href="/admin/leads/" className={linkClass(leadsActive)}>
            <Inbox className="w-4 h-4" aria-hidden="true" />
            Leads
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
