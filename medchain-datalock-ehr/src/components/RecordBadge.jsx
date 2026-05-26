import React from 'react';

/**
 * RecordBadge Component
 * Displays security trust signals for records.
 * Status: 'verified' | 'tampered' | 'unverified'
 */
export default function RecordBadge({ status }) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-teal-50 border border-teal-200 text-[11px] font-bold text-teal-800 uppercase tracking-wide">
          <svg className="w-3 h-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verified On-Chain
        </span>
      );
    case 'tampered':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 border border-red-200 text-[11px] font-bold text-red-800 uppercase tracking-wide">
          <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Hash Mismatch
        </span>
      );
    case 'unverified':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Unverified
        </span>
      );
  }
}
