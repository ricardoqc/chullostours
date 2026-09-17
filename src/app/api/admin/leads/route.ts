import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { listLeads, leadStats, updateLead, type LeadStatus } from "@/lib/leads-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUSES: LeadStatus[] = ["new", "contacted", "converted", "closed"];

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const leads = listLeads(300);
  return NextResponse.json({
    ok: true,
    leads,
    stats: leadStats(leads),
  });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json()) as { id?: string; status?: string };
  if (!body.id || !body.status || !STATUSES.includes(body.status as LeadStatus)) {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  const updated = updateLead(body.id, { status: body.status as LeadStatus });
  if (!updated) {
    return NextResponse.json({ ok: false, error: "Lead no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: updated });
}
