export type Role = "student" | "parent";
export type ConcernCategory = "admissions" | "fees" | "university" | "curriculum" | "careers";
export type LeadStatus = "new" | "contacted" | "counselling_booked" | "closed";
export type FollowUpStatus = "pending" | "done" | "overdue";
export type BriefStatus = "generated" | "pending" | "failed";

export const CONCERN_LABELS: Record<ConcernCategory, string> = {
  admissions: "Admissions & eligibility",
  fees: "Fees & financing",
  university: "University / degree arrangement",
  curriculum: "Curriculum",
  careers: "Career outcomes",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  counselling_booked: "Counselling booked",
  closed: "Closed",
};

export interface LeadInput {
  name: string;
  phone: string;
  role: Role;
  language: string;
  academicStage: string;
  interests: string[];
  concerns: ConcernCategory[];
  questions: string;
  consent: boolean;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface Brief {
  summary: string;
  verifiedFacts: { text: string; source: SourceLink; isDemo: boolean }[];
  unansweredQuestions: string[];
  nextSteps: string[];
  generatedBy: "mock" | "ai";
  generatedAt: string;
}

export interface FollowUpTask {
  id: string;
  title: string;
  due: string;
  status: FollowUpStatus;
}

export interface Lead extends LeadInput {
  id: string;
  createdAt: string;
  isSample: boolean;
  briefStatus: BriefStatus;
  brief?: Brief;
  status: LeadStatus;
  tasks: FollowUpTask[];
}
