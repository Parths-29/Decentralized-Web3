import React from 'react';

/**
 * TxStatus Component
 * Handles the visual states of blockchain transactions.
 * States: 'pending' | 'confirmed' | 'failed'
 */
export default function TxStatus({ status, blockNumber, onRetry }) {
  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
        <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin-slow" />
        <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Awaiting Confirmation...</span>
      </div>
    );
  }

  if (status === 'confirmed') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200">
        <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
          Confirmed <span className="font-mono ml-1 text-teal-600/80">#{blockNumber}</span>
        </span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wider">Failed</span>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-1 text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}
