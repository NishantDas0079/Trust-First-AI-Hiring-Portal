/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, Application, AuditEvent, ApplicationStatus } from "./types.js";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Jobs
  async getJobs(): Promise<Job[]> {
    const res = await fetch("/api/jobs");
    return handleResponse(res);
  },

  async createJob(jobData: {
    title: string;
    department: string;
    location: string;
    description: string;
    requirements: string[] | string;
    salary: string;
  }): Promise<Job> {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    const res = await fetch("/api/applications");
    return handleResponse(res);
  },

  async getApplicationById(id: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`);
    return handleResponse(res);
  },

  async trackApplications(email: string): Promise<Application[]> {
    const res = await fetch(`/api/track?email=${encodeURIComponent(email)}`);
    return handleResponse(res);
  },

  async submitApplication(appData: {
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    candidateBio: string;
    candidateSkills: string[] | string;
    resumeText: string;
  }): Promise<Application> {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appData),
    });
    return handleResponse(res);
  },

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    reviewNotes: string
  ): Promise<Application> {
    const res = await fetch(`/api/applications/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewNotes }),
    });
    return handleResponse(res);
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditEvent[]> {
    const res = await fetch("/api/audit-logs");
    return handleResponse(res);
  },
};
