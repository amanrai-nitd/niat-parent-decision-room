import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="font-display text-xl text-foreground">
            NIAT <span className="text-primary">Parent Decision Room</span>
          </Link>
          <nav className="flex gap-1 text-sm">
            <Link to="/start" className="nav-link" activeProps={{ className: "nav-link nav-active" }}>Get a brief</Link>
            <Link to="/dashboard" className="nav-link" activeProps={{ className: "nav-link nav-active" }}>Counsellor dashboard</Link>
          </nav>
        </div>
      </header>
      <div className="bg-accent px-4 py-2 text-center text-xs text-accent-foreground">
        Prototype: AI responses are simulated and leads are kept only in this browser. Sample data is labelled.
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
