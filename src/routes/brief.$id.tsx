import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { generateBrief } from "@/lib/assistant";
import { attachBrief, getLead } from "@/lib/leads-store";
import type { Brief, Lead } from "@/lib/types";

export const Route = createFileRoute("/brief/$id")({
  head: () => ({
    meta: [
      { title: "Your decision brief — NIAT Decision Room" },
      { name: "description", content: "Your personalised NIAT decision brief with sources and next steps." },
      { property: "og:title", content: "Your decision brief — NIAT Decision Room" },
      { property: "og:description", content: "Sources, open questions and next steps for your NIAT decision." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BriefPage,
});

function BriefPage() {
  const { id } = Route.useParams();
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const run = useCallback(async (l: Lead) => {
    setState("loading");
    try {
      const b = await generateBrief(l);
      if (!l.isSample) attachBrief(l.id, b);
      setBrief(b);
      setState("ready");
    } catch {
      if (!l.isSample) attachBrief(l.id, null);
      setState("error");
    }
  }, []);

  useEffect(() => {
    const l = getLead(id) ?? null;
    setLead(l);
    if (!l) return;
    if (l.brief) { setBrief(l.brief); setState("ready"); } else run(l);
  }, [id, run]);

  if (lead === undefined) return <Shell><p className="text-muted-foreground">Loading…</p></Shell>;
  if (lead === null)
    return (
      <Shell>
        <div className="card text-center">
          <h1 className="font-display text-2xl text-foreground">Brief not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been created in another browser.</p>
          <Link to="/start" className="btn-primary mt-4 inline-flex">Start a new brief</Link>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl text-foreground">Decision brief for {lead.name}</h1>
        <span className="badge badge-warn">Simulated AI response — no AI service was called</span>
      </div>
      {state === "loading" && (
        <div className="card mt-6 space-y-3" aria-busy="true">
          <p className="text-sm text-muted-foreground">Preparing your brief…</p>
          {[1, 2, 3].map((i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" />)}
        </div>
      )}
      {state === "error" && (
        <div className="alert-error mt-6">
          The brief could not be generated. <button className="underline" onClick={() => run(lead)}>Try again</button>
        </div>
      )}
      {state === "ready" && brief && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="card md:col-span-2">
            <h2 className="section-title">Summary</h2>
            <p className="mt-2 text-foreground">{brief.summary}</p>
          </section>
          <section className="card">
            <h2 className="section-title">Facts from official sources</h2>
            <ul className="mt-3 space-y-3">
              {brief.verifiedFacts.map((f) => (
                <li key={f.text} className="text-sm text-foreground">
                  {f.isDemo && <span className="badge badge-warn mr-2">Demo — verify</span>}
                  {f.text}{" "}
                  <a href={f.source.url} target="_blank" rel="noreferrer" className="text-primary underline">{f.source.label}</a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">We do not state fees, eligibility, placement statistics, admission guarantees or university details. Confirm these with NIAT directly.</p>
          </section>
          <section className="card">
            <h2 className="section-title">Questions to ask your counsellor</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground">
              {brief.unansweredQuestions.map((q) => <li key={q}>{q}</li>)}
              {lead.questions && <li><em>Your question:</em> {lead.questions}</li>}
            </ul>
          </section>
          <section className="card md:col-span-2">
            <h2 className="section-title">Recommended next steps</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground">
              {brief.nextSteps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>
          <section className="card md:col-span-2 bg-secondary">
            <p className="text-sm text-secondary-foreground">
              {lead.isSample
                ? "This is a sample lead."
                : "Your details and this brief are saved in this browser only (prototype). They have not been sent to NIAT yet."}
            </p>
            <Link to="/dashboard" className="btn-primary mt-3 inline-flex">View in counsellor dashboard</Link>
          </section>
        </div>
      )}
    </Shell>
  );
}
