import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Shell } from "@/components/Shell";
import { createLead } from "@/lib/leads-store";
import { CONCERN_LABELS, type ConcernCategory } from "@/lib/types";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Tell us about you — NIAT Decision Room" },
      { name: "description", content: "Share your questions about NIAT admissions, fees, degree, curriculum and careers." },
      { property: "og:title", content: "Tell us about you — NIAT Decision Room" },
      { property: "og:description", content: "Get a personalised NIAT decision brief." },
    ],
  }),
  component: StartPage,
});

const LANGS = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Marathi"];
const STAGES = ["Class 10", "Class 11", "Class 12 (appearing)", "Class 12 (completed)", "Gap year", "Other"];
const INTERESTS = ["Software development", "AI / ML", "Data science", "Cybersecurity", "Not sure yet"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[+\d\s-]{8,16}$/, "Enter a valid phone number"),
  role: z.enum(["student", "parent"], { message: "Choose student or parent" }),
  language: z.string().min(1, "Choose a language"),
  academicStage: z.string().min(1, "Choose an academic stage"),
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
  concerns: z.array(z.enum(["admissions", "fees", "university", "curriculum", "careers"])).min(1, "Pick at least one concern"),
  questions: z.string().trim().max(1000, "Keep it under 1000 characters"),
  consent: z.literal(true, { message: "Consent is required to continue" }),
});

function StartPage() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "", phone: "", role: "" as string, language: "", academicStage: "",
    interests: [] as string[], concerns: [] as ConcernCategory[], questions: "", consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const toggle = <K extends "interests" | "concerns">(k: K, v: string) =>
    setF((s) => ({ ...s, [k]: (s[k] as string[]).includes(v) ? (s[k] as string[]).filter((x) => x !== v) : [...s[k], v] }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      const lead = createLead(r.data);
      nav({ to: "/brief/$id", params: { id: lead.id } });
    } catch {
      setSubmitError("We couldn't store your details in this browser. Please check storage settings and try again.");
    }
  }

  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="field-error">{errors[k]}</p> : null);

  return (
    <Shell>
      <h1 className="font-display text-3xl text-foreground">Tell us about you</h1>
      <p className="mt-1 text-muted-foreground">About two minutes. Fields marked * are required.</p>
      <form onSubmit={onSubmit} noValidate className="card mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">Name *<input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /><Err k="name" /></label>
          <label className="field">Phone *<input className="input" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /><Err k="phone" /></label>
        </div>
        <fieldset>
          <legend className="field">I am a *</legend>
          <div className="mt-2 flex gap-2">
            {(["student", "parent"] as const).map((r) => (
              <button type="button" key={r} onClick={() => setF({ ...f, role: r })} className={f.role === r ? "chip chip-on" : "chip"}>
                {r === "student" ? "Student" : "Parent / guardian"}
              </button>
            ))}
          </div>
          <Err k="role" />
        </fieldset>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">Preferred language *
            <select className="input" value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>
              <option value="">Select…</option>{LANGS.map((l) => <option key={l}>{l}</option>)}
            </select><Err k="language" />
          </label>
          <label className="field">Academic stage (student) *
            <select className="input" value={f.academicStage} onChange={(e) => setF({ ...f, academicStage: e.target.value })}>
              <option value="">Select…</option>{STAGES.map((l) => <option key={l}>{l}</option>)}
            </select><Err k="academicStage" />
          </label>
        </div>
        <fieldset>
          <legend className="field">Areas of interest *</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button type="button" key={i} onClick={() => toggle("interests", i)} className={f.interests.includes(i) ? "chip chip-on" : "chip"}>{i}</button>
            ))}
          </div>
          <Err k="interests" />
        </fieldset>
        <fieldset>
          <legend className="field">Main concerns *</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(CONCERN_LABELS) as ConcernCategory[]).map((c) => (
              <button type="button" key={c} onClick={() => toggle("concerns", c)} className={f.concerns.includes(c) ? "chip chip-on" : "chip"}>{CONCERN_LABELS[c]}</button>
            ))}
          </div>
          <Err k="concerns" />
        </fieldset>
        <label className="field">Your questions (optional)
          <textarea className="input min-h-28" maxLength={1000} value={f.questions} onChange={(e) => setF({ ...f, questions: e.target.value })} placeholder="e.g. What is the total cost including hostel?" />
          <Err k="questions" />
        </label>
        <label className="flex items-start gap-3 text-sm text-foreground">
          <input type="checkbox" className="mt-1 size-4 accent-primary" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
          <span>I consent to my information being processed and stored so a NIAT counsellor can prepare my brief and contact me. (In this prototype, data is stored only in this browser.)</span>
        </label>
        <Err k="consent" />
        {submitError && <p className="alert-error">{submitError}</p>}
        <button type="submit" className="btn-primary w-full md:w-auto">Generate my decision brief</button>
      </form>
    </Shell>
  );
}
