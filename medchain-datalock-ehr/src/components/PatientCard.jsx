import React from 'react';
import RecordBadge from './RecordBadge';
import { HashDisplay } from './MedDataDisplay';

/**
 * PatientCard Component
 * Displays a patient summary with priority tiering and responsive design.
 * Priority: 'routine' | 'high' | 'critical'
 */
export default function PatientCard({ patient, priority = 'routine', onClick }) {
  
  const baseClasses = "card-lift relative bg-white border border-slate-200/60 rounded-xl p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 transition-all";
  
  // Apply priority-specific styling
  let priorityClasses = "";
  if (priority === 'high') {
    priorityClasses = "border-l-4 border-l-amber-400";
  } else if (priority === 'critical') {
    priorityClasses = "border-l-4 border-l-red-500 bg-red-50/30 shadow-sm";
  }

  return (
    <div 
      className={`${baseClasses} ${priorityClasses}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Priority Indicator Dot for Mobile */}
      {priority === 'critical' && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}

      {/* Avatar/Initials */}
      <div className="w-12 h-12 rounded-full bg-surface border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0">
        {patient.name.split(' ').map(n => n[0]).join('')}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-h3 truncate text-slate-900">{patient.name}</h3>
          <span className="text-xs font-medium text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
            {patient.age}y &middot; {patient.gender}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
          <span>ID: <HashDisplay hash={patient.id} truncate /></span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RecordBadge status={patient.verificationStatus || 'verified'} />
          {patient.lastVisit && (
            <span className="text-xs text-slate-400">Last visit: {patient.lastVisit}</span>
          )}
        </div>
      </div>

      {/* Action / Next Appointment */}
      <div className="md:ml-auto md:text-right flex flex-row justify-between md:flex-col items-center md:items-end mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Action</div>
        <div className={`text-sm font-medium ${priority === 'critical' ? 'text-red-600' : 'text-teal-600'}`}>
          {patient.nextAction || 'Review Records'}
        </div>
      </div>
    </div>
  );
}
