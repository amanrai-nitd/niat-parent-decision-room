// Decision assistant service. Currently a MOCK: no AI API is called.
// To connect a real model, replace generateBrief's body with a server function call.
import type { Brief, ConcernCategory, LeadInput, SourceLink } from "./types";

const OFFICIAL: SourceLink = { label: "NIAT official website", url: "https://www.niatindia.com/" };

// Only non-numeric, identity-level statements. Everything is flagged as demo
// until a counsellor verifies it against the official source.
const BASE_FACTS = [
  "NIAT (NxtWave Institute of Advanced Technologies) publishes its programme and admission information on its official website.",
];

const QUESTIONS: Record<ConcernCategory, string[]> = {
  admissions: [
    "What are the current eligibility criteria and is there an entrance test for this intake?",
    "What are the application deadlines for the upcoming batch?",
  ],
  fees: [
    "What is the full fee breakdown (tuition, hostel, other charges) for the entire programme?",
    "Are scholarships, instalments or education loans available, and who is eligible?",
  ],
  university: [
    "Which university awards the degree, and what is its recognition/approval status?",
    "How is teaching split between NIAT and the partner university?",
  ],
  curriculum: [
    "What does the year-by-year curriculum look like, and how often is it updated?",
    "How much of the programme is project-based or industry-led?",
  ],
  careers: [
    "Are placement outcomes published and independently audited? Ask for the official report.",
    "What internship and career-support services are provided, and from which year?",
  ],
};

export async function generateBrief(input: LeadInput): Promise<Brief> {
  await new Promise((r) => setTimeout(r, 1200)); // simulate latency
  const who = input.role === "parent" ? "your child's" : "your";
  const concerns = input.concerns.length ? input.concerns : (["admissions"] as ConcernCategory[]);
  return {
    summary: `Based on ${who} stage (${input.academicStage}) and interest in ${
      input.interests.join(", ") || "technology"
    }, this brief lists what we can point you to on official sources and what you should confirm directly with a NIAT counsellor. No fees, eligibility rules, placement figures or university details are stated here — these must come from NIAT directly.`,
    verifiedFacts: BASE_FACTS.map((text) => ({ text, source: OFFICIAL, isDemo: true })),
    unansweredQuestions: concerns.flatMap((c) => QUESTIONS[c]),
    nextSteps: [
      "Review the official NIAT website for the latest programme pages.",
      "Book an admission counselling session and bring the questions above.",
      "Ask for every fee, eligibility and placement figure in writing.",
      input.role === "parent"
        ? "Attend the counselling session together with your child."
        : "Share this brief with your parent or guardian before the session.",
    ],
    generatedBy: "mock",
    generatedAt: new Date().toISOString(),
  };
}
