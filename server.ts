/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { dbStore } from "./src/db-store.js";
import { ApplicationStatus } from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // Log requests for development
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API ROUTES (Must be defined BEFORE Vite middleware)
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get all jobs
  app.get("/api/jobs", (req, res) => {
    try {
      const jobs = dbStore.getJobs();
      res.json(jobs);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to retrieve jobs" });
    }
  });

  // Create a new job post
  app.post("/api/jobs", (req, res) => {
    try {
      const { title, department, location, description, requirements, salary } = req.body;
      
      if (!title || !department || !location || !description || !requirements) {
        return res.status(400).json({ error: "Missing required fields for job creation" });
      }

      const reqList = Array.isArray(requirements) 
        ? requirements 
        : requirements.split(',').map((r: string) => r.trim()).filter(Boolean);

      const job = dbStore.addJob({
        title,
        department,
        location,
        description,
        requirements: reqList,
        salary: salary || "Undisclosed",
        status: "Active"
      });

      res.status(201).json(job);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to create job" });
    }
  });

  // Get all applications
  app.get("/api/applications", (req, res) => {
    try {
      const applications = dbStore.getApplications();
      res.json(applications);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to retrieve applications" });
    }
  });

  // Get application by ID
  app.get("/api/applications/:id", (req, res) => {
    try {
      const appRecord = dbStore.getApplicationById(req.params.id);
      if (!appRecord) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(appRecord);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to retrieve application details" });
    }
  });

  // Track applications by email
  app.get("/api/track", (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: "Email query parameter is required" });
      }
      const applications = dbStore.getApplicationsByEmail(email);
      res.json(applications);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to track applications" });
    }
  });

  // Submit new candidate application & trigger real-time AI screening
  app.post("/api/applications", async (req, res) => {
    try {
      const { jobId, candidateName, candidateEmail, candidateBio, candidateSkills, resumeText } = req.body;

      if (!jobId || !candidateName || !candidateEmail || !candidateBio || !candidateSkills || !resumeText) {
        return res.status(400).json({ error: "Missing required fields for application submission" });
      }

      const skillsList = Array.isArray(candidateSkills)
        ? candidateSkills
        : candidateSkills.split(',').map((s: string) => s.trim()).filter(Boolean);

      // This will invoke Gemini (or fallback automatically if key is missing)
      const newApp = await dbStore.createApplication({
        jobId,
        candidateName,
        candidateEmail,
        candidateBio,
        candidateSkills: skillsList,
        resumeText
      });

      res.status(201).json(newApp);
    } catch (e: any) {
      console.error("API application submission failed:", e);
      res.status(500).json({ error: e.message || "Failed to submit application and run AI screening" });
    }
  });

  // Update application status & log audit trail
  app.post("/api/applications/:id/status", (req, res) => {
    try {
      const { status, reviewNotes } = req.body;
      
      if (!status || !Object.values(ApplicationStatus).includes(status)) {
        return res.status(400).json({ error: "Invalid or missing application status" });
      }

      const updatedApp = dbStore.updateApplicationStatus(req.params.id, status as ApplicationStatus, reviewNotes || "");
      if (!updatedApp) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(updatedApp);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to update application status" });
    }
  });

  // Get audit logs
  app.get("/api/audit-logs", (req, res) => {
    try {
      const logs = dbStore.getAuditLogs();
      res.json(logs);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to retrieve audit logs" });
    }
  });


  // VITE MIDDLEWARE CONFIGURATION

  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Serving static compiled files from ${distPath} in production mode.`);
  }

  // Start listening
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Trust-First AI Hiring server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical server startup crash:", err);
});
