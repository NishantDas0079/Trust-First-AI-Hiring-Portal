/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, FileText, Sparkles, CheckCircle2, AlertTriangle, MessageSquare, History, UserCheck, XCircle } from 'lucide-react';
import { Application, ApplicationStatus, Job } from '../types.js';

interface CandidateDetailViewProps {
  application: Application;
  job: Job | undefined;
  onBack: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus, notes: string) => Promise<void>;
}

export default function CandidateDetailView({
  application,
  job,
  onBack,
  onUpdateStatus
}: CandidateDetailViewProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [notes, setNotes] = useState(application.reviewNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const hasAI = application.aiScore !== null;
  const fitScore = application.aiScore?.fitScore || 0;

  // Fit score visual configuration
  let fitColor = "text-rose-600 border-rose-200 bg-rose-50";
  let progressColor = "bg-rose-500";
  if (fitScore >= 80) {
    fitColor = "text-emerald-600 border-emerald-200 bg-emerald-50";
    progressColor = "bg-emerald-500";
  } else if (fitScore >= 50) {
    fitColor = "text-amber-600 border-amber-200 bg-amber-50";
    progressColor = "bg-amber-500";
  }

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);
    setIsUpdating(true);

    try {
      await onUpdateStatus(application.id, status, notes.trim());
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 4000);
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update applicant status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div id="candidate-detail-view" className="space-y-8 font-sans max-w-6xl mx-auto">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBack}
          className="text-xs font-mono font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-3xs"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO PIPELINE
        </button>
        <div className="text-xs font-mono text-slate-400">
          Application ID: <span className="font-semibold text-slate-600">{application.id}</span>
        </div>
      </div>

      {/* Main Candidate Card & Position summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl shadow-3xs border border-indigo-100">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl font-bold text-slate-900">{application.candidateName}</h2>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                application.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                application.status === 'Offered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                application.status === 'Interviewing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                application.status === 'Screened' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {application.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{application.jobTitle}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {application.candidateEmail}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1 text-2xs font-mono">
                <Calendar className="w-3.5 h-3.5" /> Submitted {new Date(application.appliedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Status Action Feedback */}
        {job && (
          <div className="text-left md:text-right bg-slate-50 p-3 rounded-lg border border-slate-100 w-full md:w-auto">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">TARGET POSITION</span>
            <span className="text-xs font-bold text-slate-800">{job.title}</span>
            <span className="text-[10px] text-slate-500 block">{job.department} &bull; {job.location}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Details on Left, AI Screening and Forms on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Candidate Credentials & Resume */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biography & Skills */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Biography & Focus</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {application.candidateBio || "No biography provided by candidate."}
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2.5">Key Declared Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {application.candidateSkills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 font-mono text-xs px-2.5 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Resume */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="font-display font-bold text-sm text-slate-900">Submitted Resume/Credentials</h3>
            </div>
            <div className="bg-slate-950 text-slate-300 font-mono text-xs p-4 rounded-lg overflow-y-auto max-h-72 leading-relaxed whitespace-pre-wrap select-text selection:bg-slate-700">
              {application.resumeText || "No resume text submitted."}
            </div>
          </div>

        </div>

        {/* Right 1 Column: AI Screening Report & Status Update controls */}
        <div className="space-y-6">
          
          {/* Transparent AI Evaluation Card */}
          <div className="bg-indigo-950 rounded-xl p-5 text-white space-y-5 shadow-sm border border-indigo-900">
            <div className="flex items-center justify-between border-b border-indigo-900 pb-3">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <h3 className="font-display font-bold text-sm text-white">Gemini Screening Report</h3>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 uppercase">Veritas AI v3.5</span>
            </div>

            {hasAI ? (
              <div className="space-y-5">
                {/* Score Indicator */}
                <div className="flex items-center gap-4 bg-indigo-900/45 p-3 rounded-lg border border-indigo-900">
                  <div className={`text-xl font-mono font-bold w-14 h-14 rounded-full flex items-center justify-center border-4 ${fitColor}`}>
                    {fitScore}%
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-indigo-300">COMPATIBILITY INDEX</div>
                    <p className="text-3xs text-indigo-100 leading-relaxed mt-0.5">Calculated based on core requirement matches, bio descriptions, and skills align matrices.</p>
                  </div>
                </div>

                {/* Sub-alignment Sliders (Meters) */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-bold text-indigo-300 uppercase">Alignment Dimensions</h4>
                  
                  {/* Meter 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-3xs font-mono text-indigo-200">
                      <span>Technical Requirements</span>
                      <span className="font-bold text-indigo-100">{application.aiScore?.alignmentMeters.skills}%</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${application.aiScore?.alignmentMeters.skills}%` }}></div>
                    </div>
                  </div>

                  {/* Meter 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-3xs font-mono text-indigo-200">
                      <span>Experience Alignment</span>
                      <span className="font-bold text-indigo-100">{application.aiScore?.alignmentMeters.experience}%</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${application.aiScore?.alignmentMeters.experience}%` }}></div>
                    </div>
                  </div>

                  {/* Meter 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-3xs font-mono text-indigo-200">
                      <span>Role & Culture Sync</span>
                      <span className="font-bold text-indigo-100">{application.aiScore?.alignmentMeters.culture}%</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${application.aiScore?.alignmentMeters.culture}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Checklist matches */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-[10px] font-mono font-bold text-indigo-300 uppercase">Requirement Checklist</h4>
                  
                  {/* Matching List */}
                  {application.aiScore?.matchingSkills && application.aiScore.matchingSkills.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Requirements Met ({application.aiScore.matchingSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {application.aiScore.matchingSkills.map((s, idx) => (
                          <span key={idx} className="bg-emerald-500/10 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gaps List */}
                  {application.aiScore?.missingSkills && application.aiScore.missingSkills.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Requirements Missing ({application.aiScore.missingSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {application.aiScore.missingSkills.map((s, idx) => (
                          <span key={idx} className="bg-amber-500/10 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Narrative Explanation */}
                <div className="space-y-1.5 pt-3 border-t border-indigo-900">
                  <h4 className="text-[10px] font-mono font-bold text-indigo-300 uppercase">AI Explanation Justification</h4>
                  <p className="text-[11px] text-indigo-100 leading-relaxed bg-indigo-900/60 p-3 rounded-lg border border-indigo-900/50">
                    {application.aiScore?.explanation}
                  </p>
                  <p className="text-[9px] text-indigo-300 italic">
                    Note: Under Veritas ethics, this exact evaluation is made transparently accessible in the candidate's tracking portal.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-indigo-300 text-xs font-mono">
                AI evaluation is currently offline for this record.
              </div>
            )}
          </div>

          {/* Interactive Recruiters Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <h3 className="font-display font-bold text-sm text-slate-900">Manual Review Action</h3>
            </div>

            {updateSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xs p-3 rounded-lg">
                Applicant status and review notes updated successfully! This change has been written to the immutable audit ledger.
              </div>
            )}

            {updateError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-2xs p-3 rounded-lg">
                {updateError}
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Update Recruitment Stage</label>
                <select
                  id="recruiter-status-select"
                  value={status}
                  onChange={e => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {Object.values(ApplicationStatus).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Reviewer Internal/Public Notes</label>
                <textarea
                  id="recruiter-notes-input"
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Record interview remarks, technical feedback, or final justification. Candidates can see these transparently."
                  className="w-full text-2xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                id="submit-status-update-btn"
                type="submit"
                disabled={isUpdating}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-3xs disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                {isUpdating ? "Updating Trail..." : "Commit Status Change"}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
