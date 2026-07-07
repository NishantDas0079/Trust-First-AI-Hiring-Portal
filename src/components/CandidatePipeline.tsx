/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, SlidersHorizontal, User, Calendar, RefreshCcw } from 'lucide-react';
import { Job, Application, ApplicationStatus } from '../types.js';

interface CandidatePipelineProps {
  jobs: Job[];
  applications: Application[];
  onSelectApplication: (appId: string) => void;
  selectedJobIdFilter?: string;
  onChangeJobFilter?: (jobId: string) => void;
}

export default function CandidatePipeline({
  jobs,
  applications,
  onSelectApplication,
  selectedJobIdFilter = '',
  onChangeJobFilter
}: CandidatePipelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [scoreFilter, setScoreFilter] = useState<string>('All');

  // Stages tabs list
  const stages = ['All', ...Object.values(ApplicationStatus)];

  // Apply filters
  const filteredApps = applications.filter(app => {
    // 1. Job Filter
    if (selectedJobIdFilter && app.jobId !== selectedJobIdFilter) return false;

    // 2. Status Filter
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;

    // 3. Search Term (Name/Email/Skills)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = app.candidateName.toLowerCase().includes(term);
      const matchesEmail = app.candidateEmail.toLowerCase().includes(term);
      const matchesSkills = app.candidateSkills.some(skill => skill.toLowerCase().includes(term));
      if (!matchesName && !matchesEmail && !matchesSkills) return false;
    }

    // 4. Score Filter
    if (scoreFilter !== 'All') {
      const score = app.aiScore?.fitScore || 0;
      if (scoreFilter === 'high' && score < 80) return false;
      if (scoreFilter === 'medium' && (score < 50 || score >= 80)) return false;
      if (scoreFilter === 'low' && score >= 50) return false;
    }

    return true;
  });

  return (
    <div id="candidate-pipeline" className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Applicant Pipeline</h2>
          <p className="text-sm text-slate-500">Screen, interview, and manage active candidacies transparently.</p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <input 
              id="search-applicant-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search applicants by name, email, or skill..."
              className="w-full text-xs border border-slate-200 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Job Selection Dropdown */}
          <div>
            <select
              id="pipeline-job-filter"
              value={selectedJobIdFilter}
              onChange={e => onChangeJobFilter && onChangeJobFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">All Open Positions</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
              ))}
            </select>
          </div>

          {/* AI Score Filter */}
          <div>
            <select
              id="pipeline-score-filter"
              value={scoreFilter}
              onChange={e => setScoreFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="All">All AI Match Levels</option>
              <option value="high">High Compatibility (80+)</option>
              <option value="medium">Moderate Match (50-79)</option>
              <option value="low">Under Review (&lt;50)</option>
            </select>
          </div>

        </div>

        {/* Stages Tabs Horizontal Filter */}
        <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2 items-center">
          <span className="text-2xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> PIPELINE STAGES:
          </span>
          <div className="flex flex-wrap gap-1">
            {stages.map((stage) => (
              <button
                key={stage}
                id={`pipeline-tab-${stage}`}
                onClick={() => setStatusFilter(stage)}
                className={`text-2xs font-mono font-medium px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  statusFilter === stage
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {stage} ({
                  stage === 'All' 
                    ? (selectedJobIdFilter ? applications.filter(a => a.jobId === selectedJobIdFilter).length : applications.length)
                    : applications.filter(a => a.status === stage && (!selectedJobIdFilter || a.jobId === selectedJobIdFilter)).length
                })
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate List Results */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <User className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm font-semibold">No candidates match your current filters.</p>
            <p className="text-slate-400 text-xs">Try adjusting the search criteria or resetting filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setScoreFilter('All');
                onChangeJobFilter && onChangeJobFilter('');
              }}
              className="text-xs text-indigo-600 font-mono font-bold hover:underline inline-flex items-center gap-1 mt-2"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => {
              const fit = app.aiScore?.fitScore || 0;
              const hasScore = app.aiScore !== null;
              
              let fitBadge = "text-rose-700 bg-rose-50 border-rose-200";
              let fitText = "Critical Gap";
              if (fit >= 80) {
                fitBadge = "text-emerald-700 bg-emerald-50 border-emerald-200";
                fitText = "Strong Match";
              } else if (fit >= 50) {
                fitBadge = "text-amber-700 bg-amber-50 border-amber-200";
                fitText = "Moderate Match";
              }

              return (
                <div 
                  key={app.id} 
                  id={`candidate-card-${app.id}`}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left block: Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{app.candidateName}</h4>
                      <span className="text-xs font-mono text-slate-400 truncate">({app.candidateEmail})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{app.jobTitle}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1 text-2xs font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {app.candidateSkills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-200 font-mono text-[10px] px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                      {app.candidateSkills.length > 4 && (
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5">
                          +{app.candidateSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right block: AI Rating and actions */}
                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {/* Fit Score Indicator */}
                    <div className="text-right">
                      {hasScore ? (
                        <div className="flex items-center sm:flex-col items-start gap-2 sm:gap-0">
                          <div className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${fitBadge}`}>
                            <span>{fit}%</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{fitText}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1.5 rounded border border-slate-200">
                          <span className="animate-pulse w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                          <span>AI Processing</span>
                        </div>
                      )}
                    </div>

                    {/* Status badge & review button */}
                    <div className="flex items-center gap-3">
                      <span className={`text-2xs font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        app.status === 'Offered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        app.status === 'Interviewing' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        app.status === 'Screened' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {app.status}
                      </span>

                      <button
                        onClick={() => onSelectApplication(app.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-3xs cursor-pointer transition-all font-mono"
                      >
                        Review Profile
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
