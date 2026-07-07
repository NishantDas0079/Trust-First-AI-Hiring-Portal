/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Briefcase, Users, FileText, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { Job, Application, AuditEvent } from '../types.js';

interface RecruiterDashboardProps {
  jobs: Job[];
  applications: Application[];
  auditLogs: AuditEvent[];
  onNavigateToTab: (tab: string) => void;
  onSelectApplication: (appId: string) => void;
}

export default function RecruiterDashboard({
  jobs,
  applications,
  auditLogs,
  onNavigateToTab,
  onSelectApplication
}: RecruiterDashboardProps) {
  // Statistics Calculations
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  
  const scoredApps = applications.filter(app => app.aiScore !== null);
  const averageFit = scoredApps.length > 0
    ? Math.round(scoredApps.reduce((acc, app) => acc + (app.aiScore?.fitScore || 0), 0) / scoredApps.length)
    : 0;

  const pendingReview = applications.filter(app => app.status === "Applied" || app.status === "Screened").length;

  // Recent apps (last 3)
  const recentApps = [...applications].slice(0, 3);
  // Recent audit logs (last 5)
  const recentAudit = [...auditLogs].slice(0, 5);

  return (
    <div id="recruiter-dashboard" className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Real-time stats and audit monitoring for your transparent hiring portal.</p>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">ACTIVE JOB POSTS</span>
            <div className="text-3xl font-bold text-slate-900 font-display">{totalJobs}</div>
            <button 
              onClick={() => onNavigateToTab('jobs')}
              className="text-2xs text-indigo-600 font-semibold hover:underline"
            >
              Manage jobs &rarr;
            </button>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">TOTAL APPLICANTS</span>
            <div className="text-3xl font-bold text-slate-900 font-display">{totalApps}</div>
            <button 
              onClick={() => onNavigateToTab('pipeline')}
              className="text-2xs text-indigo-600 font-semibold hover:underline"
            >
              View pipeline &rarr;
            </button>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">AVG AI FIT SCORE</span>
            <div className="text-3xl font-bold text-slate-900 font-display flex items-baseline gap-1 font-display">
              {averageFit}%
              <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Stable
              </span>
            </div>
            <span className="text-2xs text-slate-400">Calculated across screened profiles</span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">PENDING HUMAN REVIEW</span>
            <div className="text-3xl font-bold text-slate-900 font-display">{pendingReview}</div>
            <button 
              onClick={() => onNavigateToTab('pipeline')}
              className="text-2xs text-indigo-600 font-semibold hover:underline"
            >
              Action items &rarr;
            </button>
          </div>
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Action Needed & Recent applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-base text-slate-900">Recent Applications</h3>
              <button 
                onClick={() => onNavigateToTab('pipeline')}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                View Pipeline &rarr;
              </button>
            </div>

            {recentApps.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm font-mono">
                No candidate applications submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentApps.map((app) => {
                  const fit = app.aiScore?.fitScore || 0;
                  const fitColor = fit >= 80 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : fit >= 55 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-rose-50 text-rose-700 border-rose-200";

                  return (
                    <div 
                      key={app.id} 
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{app.candidateName}</span>
                          <span className="text-xs font-mono text-slate-400">({app.candidateEmail})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-slate-600">{app.jobTitle}</span>
                          <span className="text-xs text-slate-300">&bull;</span>
                          <span className="text-2xs font-mono text-slate-400">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {app.aiScore ? (
                          <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${fitColor}`}>
                            Score: {fit}%
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            Analyzing...
                          </div>
                        )}
                        <span className={`text-2xs font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          app.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                          app.status === 'Offered' ? 'bg-emerald-50 text-emerald-600' :
                          app.status === 'Interviewing' ? 'bg-blue-50 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status}
                        </span>
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="text-xs text-slate-500 hover:text-indigo-600 font-medium px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all font-mono"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Ethics & Trust Commitments */}
          <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6 flex gap-4 items-start">
            <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-indigo-900">Demonstrated AI Transparency Commitment</h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                VeritasHire operates on a <strong>"Trust-First" transparent AI model</strong>. Every score assigned by the Gemini screening engine contains an automated, direct breakdown of matching skills, technical gaps, and alignment levels, which are published directly to candidate profile portals. Gaps are shown constructively, and human recruiters retain 100% manual overrides.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Mini Audit Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-base text-slate-900">Live Audit Trail</h3>
            <button 
              onClick={() => onNavigateToTab('audit')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              View Full Trail &rarr;
            </button>
          </div>

          <div className="space-y-5">
            {recentAudit.map((log) => {
              const actorColor = log.actor === "AI Screening Assistant" 
                ? "text-purple-600 bg-purple-50 border-purple-100" 
                : log.actor === "Recruiter" 
                ? "text-indigo-600 bg-indigo-50 border-indigo-100" 
                : "text-slate-600 bg-slate-50 border-slate-100";

              return (
                <div key={log.id} className="relative pl-5 border-l border-slate-100 space-y-1 last:pb-0">
                  {/* Circle dot marker */}
                  <div className="absolute -left-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white"></div>
                  
                  <div className="flex justify-between items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border uppercase ${actorColor}`}>
                      {log.actor}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{log.action}</div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{log.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
