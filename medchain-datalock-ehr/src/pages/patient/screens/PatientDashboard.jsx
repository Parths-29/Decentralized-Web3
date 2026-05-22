import { useNavigate } from 'react-router-dom'
import {
  Pill, FileText, AlertTriangle, Heart, Activity, Thermometer,
  CalendarClock, Clock, Link2, ChevronRight, ShieldAlert,
  CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus
} from 'lucide-react'

const stats = [
  {
    label: 'Active Meds',
    value: '3',
    change: '1 refill due',
    trend: 'warn',
    icon: <Pill size={20} />,
    accent: '#0d9488',
    bg: 'from-teal-50 to-cyan-50',
    border: 'border-teal-100',
  },
  {
    label: 'Reports',
    value: '8',
    change: '2 new uploads',
    trend: 'up',
    icon: <FileText size={20} />,
    accent: '#0ea5e9',
    bg: 'from-sky-50 to-blue-50',
    border: 'border-sky-100',
  },
  {
    label: 'Alerts',
    value: '2',
    change: '1 unread',
    trend: 'warn',
    icon: <AlertTriangle size={20} />,
    accent: '#f59e0b',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
  },
  {
    label: 'Health Score',
    value: '72',
    change: '+4 this month',
    trend: 'up',
    icon: <Heart size={20} />,
    accent: '#10b981',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
]

const vitals = [
  { label: 'Blood Pressure', value: '145/90', unit: 'mmHg', status: 'high', icon: <Activity size={16}/> },
  { label: 'Heart Rate', value: '78', unit: 'bpm', status: 'normal', icon: <Heart size={16}/> },
  { label: 'Temperature', value: '98.4', unit: '°F', status: 'normal', icon: <Thermometer size={16}/> },
  { label: 'SpO2', value: '97', unit: '%', status: 'normal', icon: <TrendingUp size={16}/> },
]

const medicines = [
  { name: 'Amlodipine', dose: '5mg', freq: 'Once daily', time: '8:00 AM', status: 'taken' },
  { name: 'Metformin', dose: '500mg', freq: 'Twice daily', time: '1:00 PM', status: 'pending' },
  { name: 'Atorvastatin', dose: '10mg', freq: 'Once daily', time: '9:00 PM', status: 'pending' },
]

const activity = [
  { title: 'Prescription updated by Dr. Sharma', time: 'Today, 10:36 AM', icon: <FileText size={14}/>, color: 'text-sky-500', bg: 'bg-sky-50' },
  { title: 'Lipid Profile report uploaded', time: '18 Apr 2026', icon: <TrendingUp size={14}/>, color: 'text-teal-500', bg: 'bg-teal-50' },
  { title: 'Consent granted to Dr. Sharma', time: '15 Apr 2026', icon: <CheckCircle2 size={14}/>, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Blood pressure alert triggered', time: '10 Apr 2026', icon: <AlertCircle size={14}/>, color: 'text-amber-500', bg: 'bg-amber-50' },
]

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={12} className="text-emerald-500"/>
  if (trend === 'down') return <TrendingDown size={12} className="text-red-400"/>
  return <Minus size={12} className="text-amber-400"/>
}

const statusColor = (s) => ({
  high:   'text-red-500',
  low:    'text-amber-500',
  normal: 'text-emerald-500',
}[s] || 'text-slate-600')

const statusBadge = (s) => ({
  high:   'bg-red-50 text-red-600 border-red-100',
  low:    'bg-amber-50 text-amber-600 border-amber-100',
  normal: 'bg-emerald-50 text-emerald-600 border-emerald-100',
}[s] || '')

export default function PatientDashboard() {
  const nav = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="p-7 space-y-6">

      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{greeting}, Arjun</h2>
          <p className="text-sm text-slate-400 mt-0.5">Here's your health summary for today</p>
        </div>
        <button
          onClick={() => nav('/patient/emergency')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition">
          <ShieldAlert size={15}/> Emergency Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i}
            className={`bg-gradient-to-br ${s.bg} border ${s.border} rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${s.accent}18`, color: s.accent }}>
                {s.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{s.value}</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <TrendIcon trend={s.trend}/>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-5">

        {/* Left — Vitals + Medicines */}
        <div className="col-span-2 space-y-5">

          {/* Vitals */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-teal-500"/>
                <span className="text-sm font-semibold text-slate-700">Vitals Overview</span>
              </div>
              <span className="text-xs text-slate-400">Last updated: Today, 9:00 AM</span>
            </div>
            <div className="grid grid-cols-4 divide-x divide-slate-50">
              {vitals.map((v, i) => (
                <div key={i} className="px-5 py-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <span style={{ color: v.status === 'high' ? '#ef4444' : '#0d9488' }}>{v.icon}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{v.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${statusColor(v.status)}`}>{v.value}
                    <span className="text-xs font-normal text-slate-400 ml-1">{v.unit}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit ${statusBadge(v.status)}`}>
                    {v.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Appointment Banner */}
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50">
            <CalendarClock size={18} className="text-teal-500 flex-shrink-0"/>
            <div className="flex-1">
              <span className="text-sm font-semibold text-slate-700">Next appointment: </span>
              <span className="text-sm text-slate-500">Dr. Riya Sharma · Cardiology</span>
            </div>
            <span className="text-sm font-bold text-teal-600">30 Apr 2026</span>
          </div>

          {/* Medicines */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill size={15} className="text-teal-500"/>
                <span className="text-sm font-semibold text-slate-700">Today's Medicines</span>
              </div>
              <button onClick={() => nav('/patient/medicines')}
                className="text-xs text-teal-500 hover:text-teal-700 font-medium flex items-center gap-0.5">
                View all <ChevronRight size={13}/>
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {medicines.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      m.status === 'taken' ? 'bg-emerald-50' : 'bg-amber-50'
                    }`}>
                      <Pill size={15} className={m.status === 'taken' ? 'text-emerald-500' : 'text-amber-500'}/>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{m.name}
                        <span className="ml-2 text-xs font-normal text-slate-400">{m.dose}</span>
                      </div>
                      <div className="text-xs text-slate-400">{m.freq}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11}/>{m.time}
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      m.status === 'taken'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {m.status === 'taken' ? 'Taken' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Activity + Blockchain */}
        <div className="space-y-5">

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-sky-500"/>
              <span className="text-sm font-semibold text-slate-700">Recent Activity</span>
            </div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${a.bg}`}>
                    <span className={a.color}>{a.icon}</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-700 leading-snug">{a.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Status */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <Link2 size={15} className="text-teal-500"/>
              <span className="text-sm font-semibold text-slate-700">Blockchain Status</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Your records are immutably stored and verified</p>
            <div className="space-y-2.5 text-sm">
              {[
                ['Block Height', '#2,841,022', 'font-mono font-bold text-sky-600'],
                ['Records Stored', '14,822', 'font-bold text-slate-700'],
                ['Network Status',
                  <span key="ns" className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>,
                  ''],
                ['Last Sync', '2 min ago', 'text-slate-400'],
              ].map(([k, v, vc], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">{k}</span>
                  <span className={`text-xs ${vc}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
