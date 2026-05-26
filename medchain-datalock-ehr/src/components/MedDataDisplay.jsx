import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * MedDataDisplay
 * Formats IDs, hashes, and clinical dosages.
 */
export function HashDisplay({ hash, truncate = true }) {
  const [copied, setCopied] = useState(false);

  const displayHash = truncate && hash.length > 12 
    ? `${hash.slice(0, 6)}...${hash.slice(-4)}` 
    : hash;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 bg-surface border border-slate-200/60 rounded text-mono-hash text-slate-600 group hover:border-slate-300 transition-colors">
      <span>{displayHash}</span>
      <button 
        onClick={handleCopy} 
        className="text-slate-400 hover:text-teal-600 transition-colors p-0.5"
        title="Copy Hash"
      >
        {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export function DrugDisplay({ name, dose, frequency }) {
  return (
    <div className="flex flex-col">
      <span className="text-drug-name text-sm">{name}</span>
      <span className="text-drug-dose text-xs mt-0.5">{dose} &middot; {frequency}</span>
    </div>
  );
}
