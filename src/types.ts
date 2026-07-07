/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ApplicationStatus {
  Applied = "Applied",
  Screened = "Screened",
  Interviewing = "Interviewing",
  Offered = "Offered",
  Rejected = "Rejected"
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  status: "Active" | "Closed";
  createdAt: string;
}

export interface AIScore {
  fitScore: number;
  explanation: string;
  matchingSkills: string[];
  missingSkills: string[];
  alignmentMeters: {
    experience: number;
    skills: number;
    culture: number;
  };
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidateBio: string;
  candidateSkills: string[];
  resumeText: string;
  status: ApplicationStatus;
  appliedAt: string;
  aiScore: AIScore | null;
  reviewNotes: string;
  lastUpdated: string;
}

export interface AuditEvent {
  id: string;
  applicationId?: string;
  applicantName?: string;
  jobTitle?: string;
  timestamp: string;
  action: string;
  actor: "AI Screening Assistant" | "Recruiter" | "Candidate";
  details: string;
}
