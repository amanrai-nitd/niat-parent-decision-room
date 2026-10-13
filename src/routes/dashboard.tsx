import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { listLeads, updateLead } from "@/lib/leads-store";
import { CONCERN_LABELS, LEAD_STATUS_LABELS, type ConcernCategory, type FollowUpStatus, type Lead, type LeadStatus } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Counsellor dashboard — NIAT Decision Room" },
      { name: "description", content: "Track leads, concerns, brief status and follow-up tasks." },
      { property: "og:title", content: "Counsellor dashboard — NIAT Decision Room" },
      { property: "og:description", content: "Leads and follow-ups for NIAT admission counsellors." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [concern, setConcern] = useState<"" | ConcernCategory>("");
  const [follow, setFollow] = useState<"" | FollowUpStatus>("");
  useEffect(() => setLeads(listLeads()), []);

  const rows = useMemo(
    () => (leads ?? []).filter((l) => (!concern || l.concerns.includes(concern)) && (!follow || l.tasks.some((t) => t.status === follow))),
    [leads, concern, follow],
  );

  function setStatus(l: Lead, status: LeadStatus) {
    updateLead(l.id, { status });
    setLeads(listLeads());
  }
  function completeTask(l: Lead, taskId: string) {
    updateLead(l.id, { tasks: l.tasks.map((t) => (t.id === taskId ? { ...t, status: "done" } : t)) });
    setLeads(listLeads());
  }

  return (
    <Shell>
      <h1 className="font-display text-3xl text-foreground">Counsellor dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Rows marked “Sample” are demonstration data and cannot be edited.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <label className="field">Concern
          <select className="input" value={concern} onChange={(e) => setConcern(e.target.value as ConcernCategory | "")}>
            <option value="">All concerns</option>
            {Object.entries(CONCERN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="field">Follow-up
          <select className="input" value={follow} onChange={(e) => setFollow(e.target.value as FollowUpStatus | "")}>
            <option value="">All</option><option value="pending">Pending</option><option value="overdue">Overdue</option><option value="done">Done</option>
          </select>
        </label>
      </div>
      {leads === null ? (
        <p className="mt-6 text-muted-foreground">Loading leads…</p>
      ) : rows.length === 0 ? (
        <div className="card mt-6 text-center">
          <p className="text-foreground">No leads match these filters.</p>
          <button className="mt-2 text-sm text-primary underline" onClick={() => { setConcern(""); setFollow(""); }}>Clear filters</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {rows.map((l) => (
            <article key={l.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-foreground">
                    {l.name} {l.isSample && <span className="badge badge-warn ml-1">Sample</span>}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {l.role === "parent" ? "Parent" : "Student"} · {l.language} · {l.academicStage} · {new Date(l.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${l.briefStatus === "generated" ? "badge-ok" : l.briefStatus === "failed" ? "badge-bad" : "badge-muted"}`}>Brief: {l.briefStatus}</span>
                  <select aria-label="Lead status" className="input py-1 text-xs" value={l.status} disabled={l.isSample} onChange={(e) => setStatus(l, e.target.value as LeadStatus)}>
                    {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {l.concerns.map((c) => <span key={c} className="badge badge-muted">{CONCERN_LABELS[c]}</span>)}
              </div>
              {l.questions && <p className="mt-2 text-sm text-foreground">“{l.questions}”</p>}
              <ul className="mt-3 space-y-1 border-t border-border pt-3">
                {l.tasks.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-foreground">{t.title} <span className="text-muted-foreground">· due {t.due}</span></span>
                    <span className="flex items-center gap-2">
                      <span className={`badge ${t.status === "done" ? "badge-ok" : t.status === "overdue" ? "badge-bad" : "badge-muted"}`}>{t.status}</span>
                      {t.status !== "done" && !l.isSample && <button className="text-xs text-primary underline" onClick={() => completeTask(l, t.id)}>Mark done</button>}
                    </span>
                  </li>
                ))}
              </ul>
              {!l.isSample && <Link to="/brief/$id" params={{ id: l.id }} className="mt-3 inline-block text-sm text-primary underline">Open brief</Link>}
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}
