/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Briefcase, UserCheck, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingScreenProps {
  onSelectRole: (role: 'recruiter' | 'candidate') => void;
}

export default function LandingScreen({ onSelectRole }: LandingScreenProps) {
  return (
    <div id="landing-screen" className="min-h-screen bg-slate-50 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] flex flex-col justify-between font-sans text-slate-800">
      {/* Top Banner */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold font-display shadow-xs">
              V
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              VeritasHire <span className="text-indigo-600 underline decoration-2 underline-offset-4 font-mono text-xs">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-2xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>AI-Assisted &bull; Recruiter-Verified</span>
          </div>
        </div>
      </header>

      {/* Main Hero and Selector */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col justify-center items-center text-center">
        {/* Value Prop Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-2xl"
        >
          <div className="inline-block bg-indigo-50 text-indigo-700 text-3xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100 shadow-3xs">
            Open-Ledger Showcase MVP
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-none">
            Hiring built on <span className="text-indigo-600 underline decoration-indigo-200 decoration-4">mutual trust</span> and transparency
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            VeritasHire screens candidate profiles using advanced Gemini AI, publishing instant, constructive feedback reports and immutable audit trails directly to candidate portals.
          </p>
        </motion.div>

        {/* Role Selector Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mt-12"
        >
          {/* Recruiter Workspace Card */}
          <button
            id="enter-recruiter"
            onClick={() => onSelectRole('recruiter')}
            className="group relative text-left bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between h-64 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div>
              <div className="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white p-3 rounded-lg inline-block transition-colors duration-300 border border-indigo-100/30">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-5 group-hover:text-indigo-600 transition-colors duration-300">
                Recruiter Workspace
              </h3>
              <p className="text-slate-500 text-2xs mt-2 leading-relaxed">
                Manage active job opportunities, review applications, analyze automated Gemini alignment reports, and leave manual feedback audit logs.
              </p>
            </div>
            <div className="text-indigo-600 font-mono text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-all">
              Access Recruiter Hub &rarr;
            </div>
          </button>

          {/* Candidate Transparent Portal Card */}
          <button
            id="enter-candidate"
            onClick={() => onSelectRole('candidate')}
            className="group relative text-left bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-500 transition-all duration-300 flex flex-col justify-between h-64 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <div>
              <div className="bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white p-3 rounded-lg inline-block transition-colors duration-300 border border-teal-100/30">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-5 group-hover:text-teal-600 transition-colors duration-300">
                Candidate Portal
              </h3>
              <p className="text-slate-500 text-2xs mt-2 leading-relaxed">
                Browse open roles, submit real-time profile credentials, and instantly track your application status with 100% transparent AI reports.
              </p>
            </div>
            <div className="text-teal-600 font-mono text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-all">
              Browse Open Careers &rarr;
            </div>
          </button>
        </motion.div>

        {/* Mini Trust Highlights */}
        <div className="grid grid-cols-3 gap-4 max-w-lg w-full border-t border-slate-200/80 mt-16 pt-6 text-slate-400 font-mono text-[10px]">
          <div className="flex flex-col items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-500/80" />
            <span className="font-medium text-slate-500">Open AI Report</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500/80" />
            <span className="font-medium text-slate-500">Immutable Ledger</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-teal-500/80" />
            <span className="font-medium text-slate-500">Human-In-The-Loop</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 px-6 bg-white/85 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-400">
          <span>&copy; 2026 VeritasHire Showcase. Built for demonstration.</span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
            System: <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sandbox Live
          </span>
        </div>
      </footer>
    </div>
  );
}
