/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Mail, Sparkles, CheckCircle2, AlertCircle, History, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import { Application, ApplicationStatus } from '../types.js';

interface CandidateStatusTrackerProps {
  onSearch: (email: string) => Promise<Application[]>;
  initialApplications?: Application[];
  initialEmail?: string;
  onGoToJobBoard: () => void;
}

export default function CandidateStatusTracker({
  onSearch,
  initialApplications = [],
  initialEmail = '',
  onGoToJobBoard
}: CandidateStatusTrackerProps) {
  const [email, setEmail] = useState(initialEmail);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searched, setSearched] = useState(initialEmail !== '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      return setError("Please provide a valid email address.");
    }

    setError('');
    setIsLoading(true);
    setSelectedApp(null);

    try {
      const results = await onSearch(email.trim().toLowerCase());
      setApplications(results);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve status records.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pipeline step order helper
  const stagesOrdered = [
    ApplicationStatus.Applied,
    ApplicationStatus.Screened,
    ApplicationStatus.Interviewing,
    ApplicationStatus.Offered // Or Rejected
  ];

  const getStageStep = (currentStatus: ApplicationStatus): number => {
    if (currentStatus === ApplicationStatus.Rejected) return 3; // Final step (with error/fail design)
    return stagesOrdered.indexOf(currentStatus);
  };

  return (
    <div id="candidate-status-tracker" className="max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Track My Applications</h2>
        <p className="text-sm text-slate-500">Access transparent screening metrics, recruiter notes, and real-time status timelines.</p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-1.5 flex-1 w-full">
            <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Enter Registered Email</label>
            <div className="relative">
              <input 
                id="tracker-email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. liam.s@example.com"
                className="w-full text-xs border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <button
            id="tracker-search-btn"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-6 rounded-lg shadow-3xs cursor-pointer transition-all font-mono"
          >
            {isLoading ? "Searching Ledger..." : "Check Status"}
          </button>
        </form>
        {error && <p className="text-rose-600 text-2xs mt-2 font-medium">{error}</p>}
      </div>

      {/* Main Results View */}
      {searched && (
        <div className="space-y-6">
          {applications.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-full inline-block text-slate-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-slate-900">No applications found</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  We couldn't find any registered application associated with <strong>{email}</strong> on our ledger.
                </p>
              </div>
              <button
                onClick={onGoToJobBoard}
                className="text-xs text-indigo-600 font-mono font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Browse Open Roles &rarr;
              </button>
            </div>
          ) : (
            /* Applications List / Detail Split */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Applications List */}
              <div className="space-y-4 lg:col-span-1">
                <h3 className="font-display font-bold text-xs font-mono text-slate-400 uppercase">My Submitted Applications ({applications.length})</h3>
                
                <div className="space-y-3">
                  {applications.map((app) => {
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <button
                        key={app.id}
                        id={`tracker-app-card-${app.id}`}
                        onClick={() => setSelectedApp(app)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                          isSelected 
                            ? 'bg-indigo-50/60 border-indigo-400 shadow-3xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="space-y-1 pr-2 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{app.jobTitle}</h4>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                          app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          app.status === 'Offered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          app.status === 'Interviewing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          app.status === 'Screened' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {app.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Application Tracking Detail */}
              <div className="lg:col-span-2">
                {selectedApp ? (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-8">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-900">{selectedApp.jobTitle}</h3>
                        <p className="text-2xs text-slate-400 font-mono mt-0.5">Application Reference: {selectedApp.id}</p>
                      </div>
                      <span className={`text-2xs font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        selectedApp.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        selectedApp.status === 'Offered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        selectedApp.status === 'Interviewing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        selectedApp.status === 'Screened' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {selectedApp.status}
                      </span>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase">Recruitment Journey Pipeline</h4>
                      
                      <div className="grid grid-cols-4 gap-2 relative">
                        {/* Connecting background bar */}
                        <div className="absolute left-[12%] right-[12%] top-[10px] bg-slate-100 h-1 z-0"></div>
                        
                        {stagesOrdered.map((stage, idx) => {
                          const currentStep = getStageStep(selectedApp.status);
                          const isRejected = selectedApp.status === ApplicationStatus.Rejected;
                          
                          let isPast = idx < currentStep;
                          let isCurrent = idx === currentStep;
                          
                          // Custom handling for 4th step if rejected
                          let stepLabel: string = stage;
                          if (idx === 3 && isRejected) {
                            stepLabel = "Rejected";
                          }

                          let nodeColor = "bg-slate-100 border-slate-200 text-slate-400";
                          if (isPast) {
                            nodeColor = "bg-indigo-600 border-indigo-600 text-white";
                          } else if (isCurrent) {
                            nodeColor = isRejected && idx === 3
                              ? "bg-rose-600 border-rose-600 text-white"
                              : "bg-indigo-50 border-indigo-600 text-indigo-600 font-bold ring-2 ring-indigo-100";
                          }

                          return (
                            <div key={idx} className="flex flex-col items-center text-center space-y-1.5 z-10">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-2xs font-mono font-semibold ${nodeColor}`}>
                                {idx + 1}
                              </div>
                              <span className={`text-[10px] font-mono font-bold block ${
                                isCurrent ? 'text-slate-900' : 'text-slate-400'
                              }`}>
                                {stepLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Respect-First Feedback Letter (If Rejected) */}
                    {selectedApp.status === ApplicationStatus.Rejected && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-rose-800">
                          <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                          <h4 className="font-display font-bold text-sm">Transparency & Respect Feedback</h4>
                        </div>
                        <div className="text-xs text-rose-700 leading-relaxed font-sans space-y-2 select-text">
                          <p>Hi {selectedApp.candidateName},</p>
                          <p>
                            Thank you for applying to the {selectedApp.jobTitle} position. While we cannot move forward with your profile at this time, we want to maintain absolute transparency. Our recruiting panel and AI analysis noted deep professional alignment with several skills, but found minor technical gaps in requested proficiencies like <strong>{selectedApp.aiScore?.missingSkills.slice(0, 2).join(' and ') || 'enterprise architecture scale'}</strong>.
                          </p>
                          <p>
                            We have recorded your credentials in our high-match radar, and your strong score of {selectedApp.aiScore?.fitScore}% indicates you would be an outstanding candidate for upcoming projects. We wish you the absolute best.
                          </p>
                          <p className="italic font-medium">The Veritas Hiring Panel</p>
                        </div>
                      </div>
                    )}

                    {/* AI Scoring report */}
                    {selectedApp.aiScore && (
                      <div className="bg-indigo-950 rounded-xl p-5 text-white space-y-5 shadow-sm border border-indigo-900">
                        <div className="flex items-center justify-between border-b border-indigo-900 pb-3">
                          <div className="flex items-center gap-1.5 text-indigo-300">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            <h4 className="font-display font-bold text-sm text-white">Veritas AI Transparency Report</h4>
                          </div>
                          <span className="text-[9px] font-mono text-indigo-400 uppercase">Exact Score Match</span>
                        </div>

                        {/* Top banner fit score */}
                        <div className="flex items-center gap-4 bg-indigo-900/45 p-3.5 rounded-xl border border-indigo-900">
                          <div className={`text-xl font-mono font-bold w-14 h-14 rounded-full flex items-center justify-center border-4 ${
                            selectedApp.aiScore.fitScore >= 80 ? "border-emerald-500 text-emerald-400 bg-indigo-950" : "border-amber-500 text-amber-400 bg-indigo-950"
                          }`}>
                            {selectedApp.aiScore.fitScore}%
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase block">Calculated Compatibility Index</span>
                            <p className="text-3xs text-indigo-100 leading-relaxed">We display this exact score and justification to help candidates understand our evaluation transparently.</p>
                          </div>
                        </div>

                        {/* Sliders */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-900/30 p-3 rounded-lg border border-indigo-900">
                          <div className="text-center space-y-1">
                            <span className="text-[9px] font-mono text-indigo-300 block uppercase">Technical Skills</span>
                            <strong className="text-base font-mono text-white">{selectedApp.aiScore.alignmentMeters.skills}%</strong>
                          </div>
                          <div className="text-center space-y-1 border-t sm:border-t-0 sm:border-x border-indigo-900 py-2 sm:py-0">
                            <span className="text-[9px] font-mono text-indigo-300 block uppercase">Experience Depth</span>
                            <strong className="text-base font-mono text-white">{selectedApp.aiScore.alignmentMeters.experience}%</strong>
                          </div>
                          <div className="text-center space-y-1">
                            <span className="text-[9px] font-mono text-indigo-300 block uppercase">Bio & Culture Sync</span>
                            <strong className="text-base font-mono text-white">{selectedApp.aiScore.alignmentMeters.culture}%</strong>
                          </div>
                        </div>

                        {/* Match Tags */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">Matching requirements ({selectedApp.aiScore.matchingSkills.length})</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedApp.aiScore.matchingSkills.map((s, idx) => (
                                <span key={idx} className="bg-emerald-500/10 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase block font-semibold">Identified Skill Gaps ({selectedApp.aiScore.missingSkills.length})</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedApp.aiScore.missingSkills.length > 0 ? selectedApp.aiScore.missingSkills.map((s, idx) => (
                                <span key={idx} className="bg-amber-500/10 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/20">
                                  {s}
                                </span>
                              )) : (
                                <span className="text-[10px] text-indigo-300 font-mono italic">No gaps identified</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Explanation block */}
                        <div className="space-y-1 pt-3 border-t border-indigo-900 text-left">
                          <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase block">Detailed Match Analysis</span>
                          <p className="text-[11px] text-indigo-100 leading-relaxed bg-indigo-900/60 p-3 rounded-lg border border-indigo-900/50 font-sans select-text">
                            {selectedApp.aiScore.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Recruiter manual notes (If Present) */}
                    {selectedApp.reviewNotes && (
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-slate-800">
                          <History className="w-4 h-4 text-indigo-600 shrink-0" />
                          <h4 className="font-display font-bold text-sm">Reviewer Manual Remarks</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-150 select-text">
                          "{selectedApp.reviewNotes}"
                        </p>
                        <span className="text-[9px] font-mono text-slate-400 block">
                          Last updated by hiring team on {new Date(selectedApp.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-mono h-64 flex flex-col justify-center items-center">
                    <ArrowLeft className="w-5 h-5 text-slate-300 mb-2 animate-pulse" />
                    <span>Select an application from the left panel to review tracking milestones, feedback explanations, and timeline logs.</span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
