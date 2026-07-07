/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, ListPlus, Send, Sparkles, CheckCircle } from 'lucide-react';
import { Job } from '../types.js';

interface JobCreatorScreenProps {
  onJobCreated: (job: {
    title: string;
    department: string;
    location: string;
    description: string;
    requirements: string;
    salary: string;
  }) => Promise<void>;
  onNavigateToTab: (tab: string) => void;
}

export default function JobCreatorScreen({ onJobCreated, onNavigateToTab }: JobCreatorScreenProps) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    "Engineering",
    "Product & Design",
    "Developer Relations",
    "Sales & Marketing",
    "Operations",
    "Human Resources"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Simple Form Validation
    if (!title.trim()) return setError("Job title is required.");
    if (!location.trim()) return setError("Location/Work mode is required.");
    if (!description.trim()) return setError("Job description is required.");
    if (!requirements.trim()) return setError("At least one core requirement skill is required.");

    setIsSubmitting(true);
    try {
      await onJobCreated({
        title: title.trim(),
        department,
        location: location.trim(),
        description: description.trim(),
        requirements,
        salary: salary.trim() || "Undisclosed"
      });

      // Clear Form
      setTitle('');
      setLocation('');
      setDescription('');
      setRequirements('');
      setSalary('');
      setSuccess(true);
      
      // Auto dismiss success toast after 3s
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to publish job post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="job-creator-screen" className="max-w-2xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Publish New Job Post</h2>
        <p className="text-sm text-slate-500">Create an open vacancy. Candidates will immediately be able to view and apply for this role.</p>
      </div>

      {/* Status Notifications */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Job post published successfully!</p>
            <p className="text-xs text-emerald-700">The vacancy is now live on the candidate portal, and the AI screening model is trained on these requirements.</p>
            <button 
              onClick={() => onNavigateToTab('dashboard')} 
              className="text-xs font-bold text-emerald-800 underline hover:text-emerald-900 mt-2 block"
            >
              Go to Dashboard &rarr;
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 md:p-8 space-y-6">
        
        {/* Title & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 block uppercase">Job Title</label>
            <div className="relative">
              <input 
                id="job-title-input"
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <Briefcase className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 block uppercase">Department</label>
            <select
              id="job-dept-input"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 block uppercase">Location & Mode</label>
            <div className="relative">
              <input 
                id="job-location-input"
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Hybrid)"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 block uppercase">Salary Range (Optional)</label>
            <div className="relative">
              <input 
                id="job-salary-input"
                type="text" 
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="e.g. $140,000 - $170,000"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <DollarSign className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-mono font-bold text-slate-500 block uppercase">Core Requirements</label>
            <span className="text-[10px] font-mono text-slate-400">Comma-separated skills list</span>
          </div>
          <div className="relative">
            <input 
              id="job-reqs-input"
              type="text" 
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript, Tailwind CSS, PostgreSQL"
              className="w-full text-sm border border-slate-200 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <ListPlus className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400">
            These keyword tags are analyzed directly by Gemini AI during screening. Spell them accurately.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-500 block uppercase">Job Description</label>
          <textarea
            id="job-description-input"
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the role's primary focus, key projects, and ideal background."
            className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            id="submit-job-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Publishing Open Role...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish & Train Screening Model
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
