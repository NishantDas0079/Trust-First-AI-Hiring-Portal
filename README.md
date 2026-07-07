<div align="center">

[![Built with Emergent AI](https://img.shields.io/badge/Built%20with-Emergent%20AI-6C63FF?style=for-the-badge)](YOUR_EMERGENT_AI_LINK)
[![Project Type](https://img.shields.io/badge/Project-MVP%20Showcase-22C55E?style=for-the-badge)](YOUR_EMERGENT_AI_LINK)
[![Status](https://img.shields.io/badge/Status-Prototype-0EA5E9?style=for-the-badge)](YOUR_EMERGENT_AI_LINK)

</div>

# Trust-First AI Hiring Portal

A showcase MVP for a trust-first AI hiring platform that demonstrates how recruiters can screen candidates faster while keeping the process transparent, explainable, and easy to review.

This project is intentionally a **low-level implementation** built for testing, showcasing, and presentation purposes. It is not a production-grade hiring platform, but it is designed in a way that can be scaled into a much larger system later.

## Live Demo

<div align="center">

[![Google AI Studio Demo](https://img.shields.io/badge/Live%20Demo-Google%20AI%20Studio-4285F4?style=for-the-badge)](https://aistudio.google.com/apps/d84da0ca-8398-4396-9148-06412871573d?showPreview=true&showAssistant=true)
[![Lovable Demo](https://img.shields.io/badge/Live%20Demo-Lovable-FF6B6B?style=for-the-badge)](https://trustspot-hire.lovable.app)

</div>

## Problem Statement

Hiring teams often face three common issues:

- Slow manual screening.
- Low trust in AI-based decisions.
- Poor visibility into candidate progress.

This MVP explores how AI can support recruitment without turning the workflow into a black box.

## Key Features

- Recruiter dashboard with hiring overview.
- Job creation flow.
- Candidate pipeline with stage-based tracking.
- AI-generated fit scores with simple explanations.
- Candidate profile view with recruiter actions.
- Lightweight audit and trust panel.
- Candidate application form.
- Candidate status tracking page.
- Clean role-based UI for recruiter and candidate flows.

## Project Scope

This is a **demo-focused MVP** built for:
- Testing the product idea.
- Showcasing the UI/UX.
- Demonstrating workflow clarity.
- Proving scalability potential for future development.

It is **not** built as a real-world enterprise hiring system.

## Tech Stack

- Frontend: Next.js / React
- Styling: Tailwind CSS
- Backend: Node.js / FastAPI
- Database: PostgreSQL or mock data for MVP
- Deployment: Vercel / Render / similar

## Screens Included

1. Landing / login screen.
2. Recruiter dashboard.
3. Job creation screen.
4. Candidate pipeline screen.
5. Candidate detail screen.
6. Audit / trust panel.
7. Candidate application screen.
8. Candidate status screen.

## User Flow

### Recruiter Flow
1. Recruiter logs in.
2. Recruiter creates a job.
3. Candidates appear in the pipeline.
4. AI assigns a fit score and explanation.
5. Recruiter opens a candidate profile.
6. Recruiter approves, rejects, or moves the candidate.
7. All actions are recorded in an audit log.

### Candidate Flow
1. Candidate applies for a job.
2. Candidate sees application status.
3. Candidate receives a short feedback message if rejected.

## Folder Structure

```bash
/src
  /app
  /components
  /lib
  /data
  /styles
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/NishantDas0079/Trust-First-AI-Hiring-Portal
cd Trust-First-AI-Hiring-Portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open the app
```bash
http://localhost:3000
```

## Demo Notes

This project is designed to look and feel like a clean product showcase.

The emphasis is on:
- Structured workflow.
- Transparent AI assistance.
- Strong UI hierarchy.
- Easy-to-understand candidate screening.
- A polished portfolio-style presentation.

## Future Scope

If this concept is expanded later, it could include:
- Smarter AI scoring logic.
- Better analytics dashboards.
- ATS integrations.
- Real authentication.
- Candidate messaging.
- Stronger trust and audit tooling.
- Enterprise-grade workflows.

## Important Note

The visible branding in this repository is centered around **Emergent AI**.  
The actual demo links for the running application point to the **Google AI Studio** and **Lovable** versions of the build.

