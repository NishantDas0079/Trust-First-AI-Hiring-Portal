/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Sparkles, 
  RefreshCw, 
  LayoutDashboard,
  PlusCircle,
  Eye
} from 'lucide-react';
import { api } from './api.js';
import { Job, Application, AuditEvent, ApplicationStatus } from './types.js';

// Modular Views Imports
import LandingScreen from './components/LandingScreen.js';
import RecruiterDashboard from './components/RecruiterDashboard.js';
import JobCreatorScreen from './components/JobCreatorScreen.js';
import CandidatePipeline from './components/CandidatePipeline.js';
import CandidateDetailView from './components/CandidateDetailView.js';
import AuditPanel from './components/AuditPanel.js';
import CandidateJobBoard from './components/CandidateJobBoard.js';
import CandidateStatusTracker from './components/CandidateStatusTracker.js';

export default function App() {
  // Navigation Routing States
  const [role, setRole] = useState<'landing' | 'recruiter' | 'candidate'>('landing');
  const [recruiterTab, setRecruiterTab] = useState<string>('dashboard');
  const [candidateTab, setCandidateTab] = useState<string>('board');

  // Core Data States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  
  // Selection/Filtering States
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [pipelineJobFilter, setPipelineJobFilter] = useState<string>('');
  const [candidateTrackEmail, setCandidateTrackEmail] = useState<string>('');

  // Loading/Refresh States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemError, setSystemError] = useState('');

  // Load initial dataset from backend on mount
  useEffect(() => {
    fetchCoreData();
  }, []);

  const fetchCoreData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setSystemError('');

    try {
      const [fetchedJobs, fetchedApps, fetchedLogs] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
        api.getAuditLogs()
      ]);

      setJobs(fetchedJobs);
      setApplications(fetchedApps);
      setAuditLogs(fetchedLogs);
    } catch (err: any) {
      console.error("Failed to sync application data:", err);
      setSystemError(err.message || "Failed to establish database connection. Please retry.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // RECRUITER ACTIONS
  const handleCreateJob = async (jobData: {
    title: string;
    department: string;
    location: string;
    description: string;
    requirements: string;
    salary: string;
  }) => {
    await api.createJob(jobData);
    await fetchCoreData(true); // reload silently
    setRecruiterTab('dashboard'); // return to dashboard
  };

  const handleUpdateApplicationStatus = async (
    id: string,
    status: ApplicationStatus,
    reviewNotes: string
  ) => {
    await api.updateApplicationStatus(id, status, reviewNotes);
    await fetchCoreData(true); // reload silently
    
    // Update local state for immediate feedback
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, status, reviewNotes, lastUpdated: new Date().toISOString() };
      }
      return app;
    }));
  };

  // CANDIDATE ACTIONS
  const handleSubmitApplication = async (appData: {
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    candidateBio: string;
    candidateSkills: string;
    resumeText: string;
  }): Promise<Application> => {
    const createdApp = await api.submitApplication(appData);
    await fetchCoreData(true); // reload silently
    return createdApp;
  };

  const handleSearchApplications = async (email: string): Promise<Application[]> => {
    return await api.trackApplications(email);
  };

  // Quick navigation utility
  const handleSelectApplicationForReview = (appId: string) => {
    setSelectedAppId(appId);
    setRecruiterTab('pipeline');
  };

  const handleQuickTrackCandidateEmail = (email: string) => {
    setCandidateTrackEmail(email);
    setCandidateTab('track');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-600 animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">Loading Veritas Ledger</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Synchronizing job vacancies, active applications, and immutable audit logs from our sandbox secure server.
          </p>
        </div>
      </div>
    );
  }

  // 1. LANDING SCREEN
  if (role === 'landing') {
    return <LandingScreen onSelectRole={(selectedRole) => setRole(selectedRole)} />;
  }

  // 2. RECRUITER FLOW
  if (role === 'recruiter') {
    const activeApp = selectedAppId ? applications.find(a => a.id === selectedAppId) : null;
    const activeJobForApp = activeApp ? jobs.find(j => j.id === activeApp.jobId) : undefined;

    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
        
        {/* Recruiter Navigation Bar */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-30 h-14 shrink-0">
          <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center h-full">
            
            {/* Left Brand with high fidelity design underlines */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold font-display shadow-xs">V</div>
                <span className="font-display font-bold text-base tracking-tight text-slate-800">
                  VeritasHire <span className="text-indigo-600 underline decoration-2 underline-offset-4 font-mono text-xs">AI</span>
                </span>
              </div>
              
              {/* Dynamic Role Switcher */}
              <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/60">
                <button
                  onClick={() => { setRole('recruiter'); setSelectedAppId(null); }}
                  className={`px-3 py-1 text-2xs font-semibold rounded-full transition-all cursor-pointer ${
                    role === 'recruiter'
                      ? 'bg-white shadow-xs text-indigo-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Recruiter Hub
                </button>
                <button
                  onClick={() => { setRole('candidate'); setCandidateTab('board'); }}
                  className={`px-3 py-1 text-2xs font-semibold rounded-full transition-all cursor-pointer ${
                    role === 'candidate'
                      ? 'bg-white shadow-xs text-teal-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Candidate Portal
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg text-2xs font-mono">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>AI Screening Core: Active</span>
              </div>

              <button
                onClick={() => fetchCoreData(true)}
                disabled={isRefreshing}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-200"
                title="Sync database ledger"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => { setRole('landing'); setSelectedAppId(null); }}
                className="text-2xs font-mono font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60 border border-rose-200/50 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <LogOut className="w-3 h-3" /> EXIT HUB
              </button>
            </div>

          </div>
          
          {/* Mobile Tab Nav Bar */}
          <div className="md:hidden border-t border-slate-100 px-4 py-1.5 bg-slate-50 flex overflow-x-auto gap-1">
            <button
              onClick={() => { setRecruiterTab('dashboard'); setSelectedAppId(null); }}
              className={`text-2xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                recruiterTab === 'dashboard' && !selectedAppId ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-500'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setRecruiterTab('pipeline'); setSelectedAppId(null); }}
              className={`text-2xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                recruiterTab === 'pipeline' ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-500'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => { setRecruiterTab('jobs'); setSelectedAppId(null); }}
              className={`text-2xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                recruiterTab === 'jobs' && !selectedAppId ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-500'
              }`}
            >
              Publish Job
            </button>
            <button
              onClick={() => { setRecruiterTab('audit'); setSelectedAppId(null); }}
              className={`text-2xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                recruiterTab === 'audit' && !selectedAppId ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-500'
              }`}
            >
              Audit Trail
            </button>
          </div>
        </header>

        {/* Sidebar & Main Split Container */}
        <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-56 bg-white border-r border-slate-200/80 p-4 shrink-0 hidden md:flex flex-col h-full justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Main Section */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Main</div>
                <button
                  onClick={() => { setRecruiterTab('dashboard'); setSelectedAppId(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    recruiterTab === 'dashboard' && !selectedAppId
                      ? 'bg-indigo-50/80 text-indigo-700 border-l-2 border-indigo-600 rounded-l-none pl-2.5 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </button>
                <button
                  onClick={() => { setRecruiterTab('pipeline'); setSelectedAppId(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    recruiterTab === 'pipeline'
                      ? 'bg-indigo-50/80 text-indigo-700 border-l-2 border-indigo-600 rounded-l-none pl-2.5 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Jobs Pipeline
                </button>
                <button
                  onClick={() => { setRecruiterTab('jobs'); setSelectedAppId(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    recruiterTab === 'jobs' && !selectedAppId
                      ? 'bg-indigo-50/80 text-indigo-700 border-l-2 border-indigo-600 rounded-l-none pl-2.5 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Publish Job
                </button>
                <button
                  onClick={() => { setRecruiterTab('audit'); setSelectedAppId(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    recruiterTab === 'audit' && !selectedAppId
                      ? 'bg-indigo-50/80 text-indigo-700 border-l-2 border-indigo-600 rounded-l-none pl-2.5 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Audit Trail
                </button>
              </div>

              {/* Active Jobs Section */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Active Jobs</div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 px-3">
                  {jobs.length === 0 ? (
                    <div className="text-2xs text-slate-400 italic">No published jobs</div>
                  ) : (
                    jobs.slice(0, 4).map(job => (
                      <div key={job.id} className="flex items-center gap-2 text-2xs font-medium text-slate-600 hover:text-indigo-600 transition-colors truncate" title={job.title}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                        <span className="truncate">{job.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Feature Banner (High Density Style) */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-xl p-3.5 text-white space-y-1.5 shadow-sm mt-6">
              <div className="text-[9px] font-mono text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Veritas AI
              </div>
              <h4 className="text-2xs font-bold leading-snug">AI Transparency Engine</h4>
              <p className="text-[10px] text-indigo-200 leading-relaxed opacity-90">
                Gemini screens credentials fairly and shares alignment reports with candidates.
              </p>
              <div className="text-[9px] font-mono text-emerald-400 font-semibold block pt-0.5">
                Open Sandbox Enabled &bull;
              </div>
            </div>
          </aside>

          {/* Right Main Panel */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {systemError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-xl mb-6 font-mono font-bold">
                SYSTEM ERROR: {systemError}
              </div>
            )}

            {activeApp && recruiterTab === 'pipeline' ? (
              <CandidateDetailView
                application={activeApp}
                job={activeJobForApp}
                onBack={() => setSelectedAppId(null)}
                onUpdateStatus={handleUpdateApplicationStatus}
              />
            ) : recruiterTab === 'dashboard' ? (
              <RecruiterDashboard
                jobs={jobs}
                applications={applications}
                auditLogs={auditLogs}
                onNavigateToTab={(tab) => setRecruiterTab(tab)}
                onSelectApplication={handleSelectApplicationForReview}
              />
            ) : recruiterTab === 'pipeline' ? (
              <CandidatePipeline
                jobs={jobs}
                applications={applications}
                onSelectApplication={setSelectedAppId}
                selectedJobIdFilter={pipelineJobFilter}
                onChangeJobFilter={setPipelineJobFilter}
              />
            ) : recruiterTab === 'jobs' ? (
              <JobCreatorScreen
                onJobCreated={handleCreateJob}
                onNavigateToTab={setRecruiterTab}
              />
            ) : recruiterTab === 'audit' ? (
              <AuditPanel auditLogs={auditLogs} />
            ) : null}
          </main>
        </div>
      </div>
    );
  }

  // 3. CANDIDATE PORTAL FLOW
  if (role === 'candidate') {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
        
        {/* Candidate Navigation Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-30 h-14 shrink-0 shadow-xs">
          <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center h-full">
            
            {/* Left Brand with dynamic role switches */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold font-display shadow-xs">V</div>
                <span className="font-display font-bold text-base tracking-tight text-slate-800">
                  VeritasHire <span className="text-teal-600 underline decoration-2 underline-offset-4 font-mono text-xs">AI</span>
                </span>
              </div>

              {/* Dynamic Role Switcher */}
              <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/60">
                <button
                  onClick={() => { setRole('recruiter'); setSelectedAppId(null); }}
                  className={`px-3 py-1 text-2xs font-semibold rounded-full transition-all cursor-pointer ${
                    role === 'recruiter'
                      ? 'bg-white shadow-xs text-indigo-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Recruiter Hub
                </button>
                <button
                  onClick={() => { setRole('candidate'); setCandidateTab('board'); }}
                  className={`px-3 py-1 text-2xs font-semibold rounded-full transition-all cursor-pointer ${
                    role === 'candidate'
                      ? 'bg-white shadow-xs text-teal-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Candidate Portal
                </button>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="flex gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50">
              <button
                onClick={() => setCandidateTab('board')}
                className={`text-2xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  candidateTab === 'board'
                    ? 'bg-white text-slate-900 shadow-3xs border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Explore Jobs
              </button>
              <button
                onClick={() => setCandidateTab('track')}
                className={`text-2xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  candidateTab === 'track'
                    ? 'bg-white text-slate-900 shadow-3xs border border-slate-200/40'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Track My Status
              </button>
            </nav>

            {/* Exit Portal Trigger */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg text-2xs font-mono">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                <span>Active Candidate Feed</span>
              </div>
              <button
                onClick={() => { setRole('landing'); setCandidateTrackEmail(''); }}
                className="text-2xs font-mono font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <LogOut className="w-3 h-3" /> EXIT PORTAL
              </button>
            </div>

          </div>
        </header>

        {/* Candidate Portal Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {candidateTab === 'board' ? (
            <CandidateJobBoard
              jobs={jobs}
              onSubmitApplication={handleSubmitApplication}
              onTrackEmail={handleQuickTrackCandidateEmail}
            />
          ) : candidateTab === 'track' ? (
            <CandidateStatusTracker
              onSearch={handleSearchApplications}
              initialApplications={candidateTrackEmail ? applications.filter(a => a.candidateEmail.toLowerCase() === candidateTrackEmail.toLowerCase()) : []}
              initialEmail={candidateTrackEmail}
              onGoToJobBoard={() => setCandidateTab('board')}
            />
          ) : null}
        </main>
      </div>
    );
  }

  return null;
}
