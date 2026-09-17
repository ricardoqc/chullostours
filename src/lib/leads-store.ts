import fs from "fs";
import path from "path";

export type LeadType = "reservation" | "custom_trip";

export type LeadStatus = "new" | "contacted" | "converted" | "closed";

export type LeadRecord = {
  id: string;
  type: LeadType;
  status: LeadStatus;
  createdAt: string;
  ticketId?: string;
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  tourSlug?: string;
  tourTitle?: string;
  travelDate?: string;
  travelers?: number;
  totalPrice?: number;
  currency?: string;
  source?: string;
  ip?: string;
  userAgent?: string;
  payload: Record<string, unknown>;
  emailMessageId?: string;
  emailOk?: boolean;
};

const LEADS_DIR = path.join(process.cwd(), "data", "leads");

function ensureLeadsDir() {
  fs.mkdirSync(LEADS_DIR, { recursive: true });
}

export function createLeadId(prefix = "lead"): string {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}_${stamp}_${rand}`;
}

export function createTicketId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CHU-${y}${m}${day}-${rand}`;
}

export function saveLead(lead: LeadRecord): LeadRecord {
  ensureLeadsDir();
  const file = path.join(LEADS_DIR, `${lead.id}.json`);
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(lead, null, 2)}\n`, "utf-8");
  fs.renameSync(temp, file);
  return lead;
}

export function updateLead(
  id: string,
  patch: Partial<Pick<LeadRecord, "status" | "emailMessageId" | "emailOk">>
): LeadRecord | null {
  const lead = getLeadById(id);
  if (!lead) return null;
  const next: LeadRecord = { ...lead, ...patch };
  return saveLead(next);
}

export function getLeadById(id: string): LeadRecord | null {
  const file = path.join(LEADS_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as LeadRecord;
  } catch {
    return null;
  }
}

export function listLeads(limit = 200): LeadRecord[] {
  ensureLeadsDir();
  const files = fs
    .readdirSync(LEADS_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".tmp"));

  const leads: LeadRecord[] = [];
  for (const file of files) {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(LEADS_DIR, file), "utf-8")
      ) as LeadRecord;
      if (data?.id) leads.push(data);
    } catch {
      /* skip corrupt */
    }
  }

  leads.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return leads.slice(0, limit);
}

export function leadStats(leads: LeadRecord[]) {
  const byType = { reservation: 0, custom_trip: 0 };
  const byStatus: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    converted: 0,
    closed: 0,
  };
  for (const lead of leads) {
    byType[lead.type] = (byType[lead.type] || 0) + 1;
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
  }
  return { total: leads.length, byType, byStatus };
}
