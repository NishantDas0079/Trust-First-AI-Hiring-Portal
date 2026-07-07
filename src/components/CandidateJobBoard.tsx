/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, FileText, Send, Sparkles, X, CheckCircle2, Cpu } from 'lucide-react';
import { Job, Application } from '../types.js';

interface CandidateJobBoardProps {
  jobs: Job[];
  onSubmitApplication: (appData: {
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    candidateBio: string;
    candidateSkills: string;
    resumeText: string;
  }) => Promise<Application>;
  onTrackEmail: (email: string) => void;
}

export default function CandidateJobBoard({
  jobs,
  onSubmitApplication,
  onTrackEmail
}: CandidateJobBoardProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeText, setResumeText] = useState('');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successApp, setSuccessApp] = useState<Application | null>(null);

  // Custom AI Processing Loader states
  const [loaderMessage, setLoaderMessage] = useState('Initializing Gemini Screening Engine...');
  const [loaderStep, setLoaderStep] = useState(0);

  const loaderMessages = [
    "Establishing server-side connection...",
    "Sending candidate resume text to Gemini 3.5 Flash...",
    "Mapping Technical requirements and skill keywords...",
    "Assessing candidate depth of experience...",
    "Generating professional justification report...",
    "Committing immutable audit trails to Veritas ledger..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitting) {
      timer = setInterval(() => {
        setLoaderStep(prev => {
          const next = (prev + 1) % loaderMessages.length;
          setLoaderMessage(loaderMessages[next]);
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isSubmitting]);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setError('');
    setSuccessApp(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setError('');

    // Validations
    if (!name.trim()) return setError("Name is required.");
    if (!email.trim() || !email.includes('@')) return setError("A valid email address is required.");
    if (!bio.trim()) return setError("Short professional bio is required.");
    if (!skills.trim()) return setError("Skills list is required.");
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      return setError("Please provide a representative resume (at least 50 characters) so the AI can screen fairly.");
    }

    setIsSubmitting(true);
    setLoaderStep(0);
    setLoaderMessage("Initializing Gemini Screening Engine...");

    try {
      const createdApp = await onSubmitApplication({
        jobId: selectedJob.id,
        candidateName: name.trim(),
        candidateEmail: email.trim().toLowerCase(),
        candidateBio: bio.trim(),
        candidateSkills: skills.trim(),
        resumeText: resumeText.trim()
      });

      setSuccessApp(createdApp);
      // Clear fields
      setName('');
      setBio('');
      setSkills('');
      setResumeText('');
    } catch (err: any) {
      setError(err.message || "Something went wrong while submitting your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="candidate-job-board" className="space-y-8 font-sans max-w-5xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Explore open opportunities</h2>
          <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
            Apply today and experience <strong>transparent hiring</strong>. See the exact evaluation and match matrices our recruiters and AI calculate for your credentials.
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex flex-col gap-2 shrink-0 w-full md:w-auto">
          <span className="text-2xs font-mono text-slate-300">ALREADY APPLIED?</span>
          <div className="flex gap-2">
            <input 
              id="quick-track-email"
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/20 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full md:w-40"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) onTrackEmail(val.trim());
                }
              }}
            />
            <button 
              onClick={(e) => {
                const input = document.getElementById('quick-track-email') as HTMLInputElement;
                if (input && input.value.trim()) onTrackEmail(input.value.trim());
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg font-mono cursor-pointer transition-all shrink-0"
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Open Roles */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900">Current Vacancies ({jobs.length})</h3>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm font-mono border border-dashed border-slate-200 rounded-xl bg-white">
            There are currently no active job openings available. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                id={`job-card-${job.id}`}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase border border-indigo-100">
                      {job.department}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-medium flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900">{job.title}</h4>
                  
                  <div className="flex items-center gap-1 text-slate-400 text-2xs font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed pt-1.5">
                    {job.description}
                  </p>

                  {/* Requirements Preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.requirements.slice(0, 3).map((r, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-500 font-mono text-[9px] px-2 py-0.5 rounded border border-slate-100">
                        {r}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="text-[9px] font-mono text-slate-400 py-0.5">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-50 mt-5">
                  <button
                    onClick={() => handleApply(job)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-3xs cursor-pointer transition-all font-mono"
                  >
                    View Job & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applying Sliding Overlay / Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50">
          
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            
            {/* Overlay Header */}
            <div className="border-b border-slate-100 p-5 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Applying: {selectedJob.title}</h3>
                  <span className="text-[10px] text-slate-500">{selectedJob.department} &bull; {selectedJob.location}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI processing loader overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center z-20 p-8 text-center animate-fade-in">
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 p-5 rounded-2xl shadow-xs animate-bounce mb-6">
                  <Cpu className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="font-display font-bold text-lg text-slate-900">AI Screening in Progress</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                  We are processing your resume text server-side using Gemini. In accordance with our Trust-First philosophy, a full report will be available immediately after this scan completes.
                </p>

                {/* Simulated steps */}
                <div className="mt-8 flex flex-col items-center gap-2 max-w-xs w-full">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-500" 
                      style={{ width: `${((loaderStep + 1) / loaderMessages.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 animate-pulse mt-1">
                    {loaderMessage}
                  </span>
                </div>
              </div>
            )}

            {/* Core Body Container */}
            <div className="p-6 md:p-8 flex-1 space-y-8">
              
              {/* Application Success Screen */}
              {successApp ? (
                <div className="space-y-6 text-center py-10">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-full inline-block text-emerald-600 shadow-3xs">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-xl text-slate-900">Application Submitted successfully!</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{successApp.candidateName}</strong>! Your application for <strong>{successApp.jobTitle}</strong> has been secured in our system and successfully screened by Veritas AI.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left space-y-2.5 max-w-md mx-auto">
                    <h5 className="text-2xs font-mono font-bold text-slate-400 uppercase">AI Screening Highlights</h5>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Calculated Compatibility score:</span>
                      <strong className="text-indigo-600 font-mono font-bold text-sm">{successApp.aiScore?.fitScore}%</strong>
                    </div>
                    <p className="text-3xs text-slate-500 leading-normal">
                      A comprehensive breakdown of this evaluation has been generated. Use your email to track live status updates and view the complete match report.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSelectedJob(null);
                        onTrackEmail(successApp.candidateEmail);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-lg font-mono cursor-pointer transition-all"
                    >
                      Track My Application Status &rarr;
                    </button>
                    <button
                      onClick={() => setSuccessApp(null)}
                      className="text-xs text-slate-500 hover:text-slate-700 py-2 px-4 rounded-lg font-mono border border-slate-200 cursor-pointer"
                    >
                      Browse More Jobs
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Job specifications */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                    <h4 className="text-2xs font-mono font-bold text-slate-400 uppercase">POSITION SUMMARY & REQUIREMENTS</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedJob.description}</p>
                    <div className="space-y-1.5 pt-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">CORE SKILLS REQUIRED:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.requirements.map((r, idx) => (
                          <span key={idx} className="bg-white text-slate-700 font-mono text-2xs px-2 py-0.5 rounded border border-slate-200">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    
                    {error && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-2xs font-medium">
                        {error}
                      </div>
                    )}

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Your Full Name</label>
                        <input 
                          id="candidate-name-input"
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. Liam Sterling"
                          className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Your Email Address</label>
                        <input 
                          id="candidate-email-input"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="e.g. liam.s@example.com"
                          className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Biography */}
                    <div className="space-y-1.5">
                      <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Short Biography / Pitch</label>
                      <textarea
                        id="candidate-bio-input"
                        rows={3}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Share a short summary of your background, experience, and core drivers."
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Core Skills */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Key Technical Skills</label>
                        <span className="text-[9px] text-slate-400 font-mono">Comma-separated</span>
                      </div>
                      <input 
                        id="candidate-skills-input"
                        type="text"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                        className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Raw Resume Text */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Copy-Paste Resume Text</label>
                        <span className="text-[9px] text-indigo-500 font-mono font-bold">Processed by Gemini AI</span>
                      </div>
                      <textarea
                        id="candidate-resume-input"
                        rows={6}
                        value={resumeText}
                        onChange={e => setResumeText(e.target.value)}
                        placeholder="Paste your full text resume here (e.g. summary, complete employment history, achievements, and educational context)."
                        className="w-full text-xs font-mono border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <p className="text-[10px] text-slate-400">
                        Our model evaluates this text directly against the requirements of the job. Please ensure it reflects your professional credentials fairly.
                      </p>
                    </div>

                    {/* Submit application */}
                    <div className="pt-2">
                      <button
                        id="submit-application-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                      >
                        <Sparkles className="w-4 h-4" />
                        Submit & Start Real-Time AI Screening
                      </button>
                    </div>

                  </form>
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
