import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NIAT Parent Decision Room" },
      { name: "description", content: "Understand NIAT with official sources and prepare for your admission counselling." },
      { property: "og:title", content: "NIAT Parent Decision Room" },
      { property: "og:description", content: "A personalised decision brief for students and parents considering NIAT." },
    ],
  }),
  component: Index,
});

function Index() {
  const steps = [
    ["Tell us about you", "Student or parent, language, stage and your concerns."],
    ["Get your decision brief", "Official source links, open questions and next steps — no invented figures."],
    ["Talk to a counsellor", "A counsellor follows up with answers in writing."],
  ];
  return (
    <Shell>
      <section className="grid gap-10 py-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">For students & parents</p>
          <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-foreground md:text-5xl">
            Every admission question deserves a clear answer.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            Get personalised, fact-based answers about NIAT, understand what you still need to verify, and prepare for
            your next counselling conversation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/start" className="btn-primary">Get my decision brief</Link>
            <Link to="/dashboard" className="btn-outline">I'm a counsellor</Link>
          </div>
        </div>
        <ol className="space-y-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="card flex gap-4">
              <span className="font-display text-3xl text-primary">{i + 1}</span>
              <div>
                <h2 className="font-semibold text-foreground">{t}</h2>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Shell>
  );
}
