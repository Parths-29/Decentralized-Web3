import { useState } from 'react'
import {
  Eye, FileText, Upload, ShieldCheck, ShieldOff, Link2,
  UserRound, Building2, Clock, Hash, Filter, Search
} from 'lucide-react'

const allLogs = [
  {
    id: 1,
    type: 'view',
    actor: 'doctor',
    date: 'Today, 10:34 AM',
    title: 'Dr. Riya Sharma viewed your full profile',
    desc: 'AIIMS Mumbai · Authorized',
    block: '#2,841,019',
    hash: '0xA9c3...',
    tag: 'Authorized',
    tagStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 2,
    type: 'update',
    actor: 'doctor',
    date: 'Today, 10:36 AM',
    title: 'Prescription updated by Dr. Riya Sharma',
    desc: 'Amlodipine 10mg added',
    block: '#2,841,022',
    hash: '0xA7f2...',
    tag: 'Modified',
    tagStyle: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  {
    id: 3,
    type: 'upload',
    actor: 'lab',
    date: '18 Apr 2026',
    title: 'Apollo Diagnostics uploaded Lipid Profile',
    desc: 'Auto-sync · Blockchain hash stored',
    block: '#2,839,104',
    hash: '0xF1b9...',
    tag: 'Upload',
    tagStyle: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    id: 4,
    type: 'view',
    actor: 'doctor',
    date: '5 Mar 2026',
    title: 'Dr. Riya Sharma viewed Chest X-Ray',
    desc: 'AIIMS Mumbai · Authorized',
    block: '#2,830,771',
    hash: '0xC2d4...',
    tag: 'Authorized',
    tagStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 5,
    type: 'consent',
    actor: 'system',
    date: '1 Mar 2026',
    title: 'Consent granted to Dr. Anand Joshi',
    desc: 'AIIMS Mumbai · Neurologist',
    block: '#2,829,300',
    hash: '0xB8e1...',
    tag: 'Consent',
    tagStyle: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    id: 6,
    type: 'revoke',
    actor: 'system',
    date: '10 Feb 2026',
    title: 'Access revoked for Dr. Anand Joshi',
    desc: 'Patient initiated revocation',
    block: '#2,820,411',
    hash: '0xD3f7...',
    tag: 'Revoked',
    tagStyle: 'bg-red-50 text-red-500 border-red-100',
  },
]

const typeIcon = {
  view:    { icon: <Eye size={16}/>,          bg: 'bg-sky-50',     color: 'text-sky-500'     },
  update:  { icon: <FileText size={16}/>,     bg: 'bg-teal-50',    color: 'text-teal-500'    },
  upload:  { icon: <Upload size={16}/>,       bg: 'bg-violet-50',  color: 'text-violet-500'  },
  consent: { icon: <ShieldCheck size={16}/>,  bg: 'bg-emerald-50', color: 'text-emerald-500' },
  revoke:  { icon: <ShieldOff size={16}/>,    bg: 'bg-red-50',     color: 'text-red-400'     },
}

const actorIcon = {
  doctor: <UserRound size={11}/>,
  lab:    <Building2 size={11}/>,
  system: <Link2 size={11}/>,
}

const filters = ['All', 'View', 'Update', 'Upload', 'Consent', 'Revoke']

export default function PatientLogs() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = allLogs.filter(l => {
    const matchFilter = active === 'All' || l.type === active.toLowerCase()
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                        l.desc.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="p-7 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Access Logs</h2>
        <p className="text-sm text-slate-400 mt-0.5">See who accessed your health data — all entries are immutable</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Events',   value: allLogs.length,                                                           icon: <Clock size={16}/>,       bg: 'bg-sky-50',     color: 'text-sky-600',     border: 'border-sky-100'     },
          { label: 'Views',          value: allLogs.filter(l => l.type === 'view').length,                            icon: <Eye size={16}/>,         bg: 'bg-teal-50',    color: 'text-teal-600',    border: 'border-teal-100'    },
          { label: 'Modifications',  value: allLogs.filter(l => l.type === 'update' || l.type === 'upload').length,   icon: <FileText size={16}/>,    bg: 'bg-violet-50',  color: 'text-violet-600',  border: 'border-violet-100'  },
          { label: 'Consent Events', value: allLogs.filter(l => l.type === 'consent' || l.type === 'revoke').length,  icon: <ShieldCheck size={16}/>, bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-100' },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 ${s.bg} border ${s.border} rounded-xl`}>
            <span className={s.color}>{s.icon}</span>
            <div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className={`text-xs font-medium ${s.color} opacity-80`}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/5 transition text-slate-700 placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5">
          <Filter size={13} className="text-slate-400 mx-1"/>
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                active === f ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <Search size={32} className="mb-3"/>
            <span className="text-sm font-medium">No logs found</span>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[52px] top-6 bottom-6 w-px bg-slate-100 z-0"/>

            {filtered.map((l, i) => {
              const ti = typeIcon[l.type]
              const isExpanded = expanded === l.id
              return (
                <div key={l.id}
                  className={`relative flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors
                    ${i !== filtered.length - 1 ? 'border-b border-slate-50' : ''}
                    ${isExpanded ? 'bg-slate-50/60' : 'hover:bg-slate-50/40'}`}
                  onClick={() => setExpanded(isExpanded ? null : l.id)}>

                  {/* Icon dot */}
                  <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ti.bg} ${ti.color} mt-0.5`}>
                    {ti.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-sm font-semibold text-slate-800">{l.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${l.tagStyle}`}>
                            {l.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={11}/>{l.date}
                          </span>
                          <span className="flex items-center gap-1">
                            {actorIcon[l.actor]}{l.desc}
                          </span>
                        </div>

                        {/* Expanded blockchain details */}
                        {isExpanded && (
                          <div className="mt-3 p-3 bg-white border border-slate-100 rounded-lg space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 flex items-center gap-1"><Link2 size={11}/>Block</span>
                              <span className="font-mono font-bold text-sky-600">{l.block}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 flex items-center gap-1"><Hash size={11}/>Tx Hash</span>
                              <span className="font-mono text-slate-500">{l.hash}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Verification</span>
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <ShieldCheck size={11}/> Verified on chain
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
