import { useState } from 'react'
import {
  Pill, Clock, CheckCircle2, AlertCircle, Bell, ChevronRight,
  CalendarDays, TrendingUp, RefreshCw, Info
} from 'lucide-react'

const initialMeds = [
  {
    id: 1,
    color: 'bg-sky-400',
    accent: '#0ea5e9',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    name: 'Amlodipine',
    dose: '10mg',
    freq: 'Once daily at night',
    time: '9:00 PM',
    schedule: [{ label: 'Morning', status: 'done' }],
    refillDue: false,
  },
  {
    id: 2,
    color: 'bg-teal-500',
    accent: '#0d9488',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    name: 'Atorvastatin',
    dose: '20mg',
    freq: 'Once at bedtime',
    time: '10:00 PM',
    schedule: [{ label: 'Night', status: 'pending' }],
    refillDue: false,
  },
  {
    id: 3,
    color: 'bg-violet-500',
    accent: '#8b5cf6',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    name: 'Aspirin',
    dose: '75mg',
    freq: 'Once daily morning',
    time: '8:00 AM',
    schedule: [{ label: 'Morning', status: 'missed' }],
    refillDue: true,
  },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const initialAdherence = ['taken', 'taken', 'partial', 'taken', 'missed', 'taken', 'pending']

const adherenceStyle = {
  taken:   { bar: 'bg-emerald-400', label: 'text-slate-600' },
  partial: { bar: 'bg-amber-400',   label: 'text-slate-600' },
  missed:  { bar: 'bg-red-400',     label: 'text-slate-600' },
  pending: { bar: 'bg-slate-200',   label: 'text-slate-400' },
}

export default function PatientMedicines() {
  const [meds, setMeds] = useState(initialMeds)
  const [adherence, setAdherence] = useState(initialAdherence)
  const [toast, setToast] = useState(null)
  const [reminded, setReminded] = useState({})

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const takeMed = (id) => {
    setMeds(prev => prev.map(m =>
      m.id === id
        ? { ...m, schedule: m.schedule.map(s => ({ ...s, status: 'done' })) }
        : m
    ))
    // Update today (Sun = last) to taken
    setAdherence(prev => {
      const next = [...prev]
      next[6] = 'taken'
      return next
    })
    const med = meds.find(m => m.id === id)
    showToast(`${med.name} marked as taken!`, 'success')
  }

  const remindMe = (id) => {
    setReminded(prev => ({ ...prev, [id]: true }))
    const med = meds.find(m => m.id === id)
    showToast(`Reminder set for ${med.name} at ${med.time}`, 'info')
  }

  const takenCount = meds.filter(m => m.schedule.every(s => s.status === 'done')).length
  const pendingCount = meds.filter(m => m.schedule.some(s => s.status === 'pending')).length
  const missedCount  = meds.filter(m => m.schedule.some(s => s.status === 'missed')).length

  const adherenceScore = Math.round(
    (adherence.filter(a => a === 'taken').length / adherence.filter(a => a !== 'pending').length) * 100
  )

  return (
    <div className="p-7 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16}/> : <Bell size={16}/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medicine Tracker</h2>
          <p className="text-sm text-slate-400 mt-0.5">Track and manage your daily medications</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 border border-teal-100">
          <TrendingUp size={14} className="text-teal-500"/>
          <span className="text-sm font-bold text-teal-600">{adherenceScore}% adherence</span>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0"/>
          <div>
            <div className="text-xl font-bold text-emerald-600">{takenCount}</div>
            <div className="text-xs text-emerald-600 font-medium">Taken today</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <Clock size={20} className="text-amber-500 flex-shrink-0"/>
          <div>
            <div className="text-xl font-bold text-amber-600">{pendingCount}</div>
            <div className="text-xs text-amber-600 font-medium">Pending</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0"/>
          <div>
            <div className="text-xl font-bold text-red-400">{missedCount}</div>
            <div className="text-xs text-red-400 font-medium">Missed</div>
          </div>
        </div>
      </div>

      {/* Med Cards */}
      <div className="space-y-3">
        {meds.map((m) => {
          const s = m.schedule[0]
          const isTaken  = s.status === 'done'
          const isPending = s.status === 'pending'
          const isMissed  = s.status === 'missed'

          return (
            <div key={m.id}
              className={`flex items-center gap-4 p-5 bg-white rounded-xl border shadow-sm transition-all
                ${isMissed ? 'border-red-100' : isTaken ? 'border-emerald-100' : 'border-slate-100 hover:border-teal-200 hover:shadow-md'}`}>

              {/* Icon */}
              <div className={`w-12 h-12 ${m.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Pill size={22} className={m.iconColor}/>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                  <span className="text-xs text-slate-400 font-normal">{m.dose}</span>
                  {m.refillDue && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-500 border border-orange-100 rounded-full">
                      <RefreshCw size={9}/> Refill Due
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1"><Info size={11}/>{m.freq}</span>
                  <span className="flex items-center gap-1"><Clock size={11}/>{m.time}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border
                  ${isTaken  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    isPending ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-red-50 text-red-500 border-red-100'}`}>
                  {isTaken  ? <><CheckCircle2 size={11}/>{s.label} · Taken</> :
                   isPending ? <><Clock size={11}/>{s.label} · Pending</> :
                               <><AlertCircle size={11}/>{s.label} · Missed</>}
                </span>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {isTaken ? (
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 size={14}/> Done
                  </div>
                ) : isPending ? (
                  reminded[m.id] ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 text-xs font-semibold">
                      <Bell size={14}/> Reminder Set
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => takeMed(m.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: 'linear-gradient(135deg,#0d9488,#06b6d4)' }}>
                        <CheckCircle2 size={13}/> Take Now
                      </button>
                      <button onClick={() => remindMe(m.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:border-teal-300 hover:text-teal-600 transition">
                        <Bell size={13}/> Remind Me
                      </button>
                    </div>
                  )
                ) : (
                  <button onClick={() => takeMed(m.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-500 bg-red-50 text-xs font-semibold hover:bg-red-100 transition">
                    <ChevronRight size={13}/> Mark Taken
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 7-Day Adherence */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-teal-500"/>
            <span className="text-sm font-semibold text-slate-700">7-Day Adherence</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"/>Taken</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"/>Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block"/>Missed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block"/>Pending</span>
          </div>
        </div>
        <div className="flex gap-2">
          {days.map((d, i) => {
            const a = adherence[i]
            const style = adherenceStyle[a]
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group cursor-pointer">
                  <div className={`w-full h-12 rounded-lg ${style.bar} transition-all hover:opacity-80`}/>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap capitalize">
                    {a}
                  </div>
                </div>
                <span className={`text-[11px] font-semibold ${style.label}`}>{d}</span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
