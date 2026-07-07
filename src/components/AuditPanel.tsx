/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Cpu, User, FileText, CheckCircle2 } from 'lucide-react';
import { AuditEvent } from '../types.js';

interface AuditPanelProps {
  auditLogs: AuditEvent[];
}

export default function AuditPanel({ auditLogs }: AuditPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actorFilter, setActorFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    // Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesAction = log.action.toLowerCase().includes(term);
      const matchesDetails = log.details.toLowerCase().includes(term);
      const matchesName = log.applicantName?.toLowerCase().includes(term) || false;
      const matchesJob = log.jobTitle?.toLowerCase().includes(term) || false;
      if (!matchesAction && !matchesDetails && !matchesName && !matchesJob) return false;
    }

    // Actor Filter
    if (actorFilter !== 'All' && log.actor !== actorFilter) return false;

    return true;
  });

  return (
    <div id="audit-panel" className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Immutable Audit Ledger</h2>
        <p className="text-sm text-slate-500">Every recruiter action, candidate entry, and AI decision is recorded transparently.</p>
      </div>

      {/* Trust Commitment banner */}
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-emerald-900">Audit Verifiability Guaranteed</h4>
            <p className="text-xs text-emerald-700 leading-relaxed max-w-2xl">
              This log tracks candidate updates in real-time. In an active production ecosystem, these entries are sealed to ensure complete protection against bias and full transparency.
            </p>
          </div>
        </div>
        <div className="bg-white px-3 py-1 border border-emerald-100 rounded-lg text-[10px] font-mono text-emerald-700 font-semibold shadow-3xs flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          Ledger Secured
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <input 
            id="audit-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search logs by keyword, candidate name, or position..."
            className="w-full text-xs border border-slate-200 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Actor Filter */}
        <div className="relative">
          <select
            id="audit-actor-filter"
            value={actorFilter}
            onChange={e => setActorFilter(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="All">All Entities</option>
            <option value="AI Screening Assistant">AI Screening Assistant</option>
            <option value="Recruiter">Human Recruiter</option>
            <option value="Candidate">Candidate Applicants</option>
          </select>
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Audit List Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-mono">
            No audit records found matching your current filter.
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            {filteredLogs.map((log) => {
              // Icon Selection
              let ActorIcon = User;
              let actorClass = "text-indigo-600 bg-indigo-50 border-indigo-100";
              
              if (log.actor === "AI Screening Assistant") {
                ActorIcon = Cpu;
                actorClass = "text-purple-600 bg-purple-50 border-purple-100";
              } else if (log.actor === "Candidate") {
                ActorIcon = FileText;
                actorClass = "text-teal-600 bg-teal-50 border-teal-100";
              }

              return (
                <div 
                  key={log.id} 
                  id={`audit-row-${log.id}`}
                  className="flex items-start gap-4 pb-6 last:pb-0 border-b border-slate-100 last:border-0"
                >
                  {/* Actor Icon Circle */}
                  <div className={`p-2.5 rounded-xl border shrink-0 ${actorClass}`}>
                    <ActorIcon className="w-4 h-4" />
                  </div>

                  {/* Log core contents */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{log.action}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${actorClass}`}>
                          {log.actor}
                        </span>
                      </div>
                      <span className="text-3xs font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans select-text">
                      {log.details}
                    </p>

                    {/* Metadata references */}
                    {(log.applicantName || log.jobTitle) && (
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400 pt-1">
                        {log.applicantName && (
                          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            Candidate: <strong className="text-slate-600">{log.applicantName}</strong>
                          </span>
                        )}
                        {log.jobTitle && (
                          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            Role: <strong className="text-slate-600">{log.jobTitle}</strong>
                          </span>
                        )}
                        {log.applicationId && (
                          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            Ref: <strong className="text-slate-600">{log.applicationId}</strong>
                          </span>
                        )}
                      </div>
                    )}
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
