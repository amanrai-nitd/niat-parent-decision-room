// Lead repository. Currently stored in this browser's localStorage only.
// Swap these functions for database calls to persist leads centrally.
import type { Lead, LeadInput, Brief } from "./types";

const KEY = "niat-decision-room-leads-v1";

const day = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const SAMPLE: Lead[] = [
  {
    id: "sample-1", isSample: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    name: "Sample: Priya R.", phone: "+91 90000 00001", role: "parent", language: "Telugu",
    academicStage: "Class 12", interests: ["Software development"], concerns: ["fees", "university"],
    questions: "Want clarity on total fees and which university gives the degree.", consent: true,
    briefStatus: "generated", status: "contacted",
    tasks: [{ id: "t1", title: "Send official fee document", due: day(-1), status: "overdue" }],
  },
  {
    id: "sample-2", isSample: true, createdAt: new Date(Date.now() - 86400000).toISOString(),
    name: "Sample: Arjun K.", phone: "+91 90000 00002", role: "student", language: "English",
    academicStage: "Class 12 (appearing)", interests: ["AI / ML", "Data science"], concerns: ["careers", "curriculum"],
    questions: "How practical is the curriculum?", consent: true,
    briefStatus: "generated", status: "counselling_booked",
    tasks: [{ id: "t2", title: "Counselling call", due: day(2), status: "pending" }],
  },
  {
    id: "sample-3", isSample: true, createdAt: new Date().toISOString(),
    name: "Sample: Meena S.", phone: "+91 90000 00003", role: "parent", language: "Hindi",
    academicStage: "Class 11", interests: ["Cybersecurity"], concerns: ["admissions"],
    questions: "Is there an entrance exam?", consent: true,
    briefStatus: "pending", status: "new",
    tasks: [{ id: "t3", title: "First outreach call", due: day(0), status: "done" }],
  },
];

function read(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}
function write(leads: Lead[]) {
  localStorage.setItem(KEY, JSON.stringify(leads));
}

export function listLeads(): Lead[] {
  return [...read(), ...SAMPLE].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function getLead(id: string): Lead | undefined {
  return listLeads().find((l) => l.id === id);
}
export function createLead(input: LeadInput): Lead {
  const lead: Lead = {
    ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), isSample: false,
    briefStatus: "pending", status: "new",
    tasks: [{ id: crypto.randomUUID(), title: "First outreach call", due: day(1), status: "pending" }],
  };
  write([lead, ...read()]);
  return lead;
}
export function updateLead(id: string, patch: Partial<Lead>) {
  write(read().map((l) => (l.id === id ? { ...l, ...patch } : l)));
}
export function attachBrief(id: string, brief: Brief | null) {
  updateLead(id, brief ? { brief, briefStatus: "generated" } : { briefStatus: "failed" });
}
