import { useState } from 'react'
import {
  FileText, Pill, Activity, Download, Eye, ShieldCheck,
  FileImage, HeartPulse, FlaskConical, ClipboardList, User, Calendar
} from 'lucide-react'

const tabs = ['Reports', 'Prescriptions', 'Doctor Notes']

const reports = [
  {
    icon: <FileImage size={22} />,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    name: 'Chest X-Ray',
    date: '5 Mar 2026',
    type: 'DICOM',
    typeBg: 'bg-slate-100 text-slate-600',
    doctor: 'Dr. Riya Sharma',
    size: '4.2 MB',
  },
  {
    icon: <FlaskConical size={22} />,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    name: 'Lipid Profile',
    date: '18 Apr 2026',
    type: 'PDF',
    typeBg: 'bg-red-50 text-red-500',
    doctor: 'Dr. Riya Sharma',
    size: '1.1 MB',
  },
  {
    icon: <HeartPulse size={22} />,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    name: 'ECG Report',
    date: '5 Mar 2026',
    type: 'PDF',
    typeBg: 'bg-red-50 text-red-500',
    doctor: 'Dr. Riya Sharma',
    size: '890 KB',
  },
  {
    icon: <Activity size={22} />,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    name: 'Blood Panel',
    date: '10 Feb 2026',
    type: 'PDF',
    typeBg: 'bg-red-50 text-red-500',
    doctor: 'Dr. Riya Sharma',
    size: '2.3 MB',
  },
]

const prescriptions = [
  {
    id: 'P-2026-091',
    date: '24 Apr 2026',
    doctor: 'Dr. Riya Sharma',
    specialty: 'Cardiologist',
    meds: ['Amlodipine 10mg', 'Atorvastatin 20mg'],
    status: 'Active',
    statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 'P-2026-044',
    date: '10 Feb 2026',
    doctor: 'Dr. Riya Sharma',
    specialty: 'Cardiologist',
    meds: ['Metformin 500mg', 'Aspirin 75mg'],
    status: 'Expired',
    statusBg: 'bg-slate-100 text-slate-500 border-slate-200',
  },
]

const notes = [
  {
    date: '24 Apr 2026',
    doctor: 'Dr. Riya Sharma',
    specialty: 'Cardiologist',
    note: 'Patient presents with BP 145/90. Continue Amlodipine 10mg. Add Atorvastatin for elevated LDL. Follow up in 4 weeks. Lifestyle modifications advised — reduce sodium intake, 30 min daily walk recommended.',
  },
  {
    date: '10 Feb 2026',
    doctor: 'Dr. Riya Sharma',
    specialty: 'Cardiologist',
    note: 'Routine review. HbA1c within range. Blood pressure slightly elevated. Continue current medications. Patient reports mild ankle swelling — monitor.',
  },
]

function BlockchainBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-sky-50 to-teal-50 border border-teal-200 rounded-full text-[11px] font-semibold text-teal-600">
      <ShieldCheck size={11}/> Blockchain Verified
    </span>
  )
}

export default function PatientRecords() {
  const [tab, setTab] = useState(0)
  const [viewingNote, setViewingNote] = useState(null)

  return (
    <div className="p-7 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Medical Records</h2>
        <p className="text-sm text-slate-400 mt-0.5">All records are blockchain-secured and tamper-proof</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === i
                ? 'text-teal-600 border-teal-500'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── REPORTS ── */}
      {tab === 0 && (
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i}
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group">

              {/* Icon */}
              <div className={`w-12 h-12 ${r.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ${r.iconColor}`}>
                {r.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.typeBg}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={11}/>{r.date}</span>
                  <span className="flex items-center gap-1"><User size={11}/>{r.doctor}</span>
                  <span>{r.size}</span>
                </div>
                <BlockchainBadge />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => alert(`Viewing ${r.name}`)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition text-slate-600">
                  <Eye size={13}/> View
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = '#'
                    link.download = `${r.name}.${r.type.toLowerCase()}`
                    link.click()
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition text-slate-600">
                  <Download size={13}/> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRESCRIPTIONS ── */}
      {tab === 1 && (
        <div className="space-y-3">
          {prescriptions.map((p, i) => (
            <div key={i}
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group">

              {/* Icon */}
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Pill size={22} className="text-teal-600"/>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800">Prescription #{p.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.statusBg}`}>{p.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1"><Calendar size={11}/>{p.date}</span>
                  <span className="flex items-center gap-1"><User size={11}/>{p.doctor} · {p.specialty}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.meds.map((m, j) => (
                    <span key={j} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{m}</span>
                  ))}
                </div>
                <BlockchainBadge />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => alert(`Viewing Prescription #${p.id}`)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition text-slate-600">
                  <Eye size={13}/> View
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([`Prescription #${p.id}\nDate: ${p.date}\nDoctor: ${p.doctor}\nMedicines: ${p.meds.join(', ')}`], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Prescription-${p.id}.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition text-slate-600">
                  <Download size={13}/> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DOCTOR NOTES ── */}
      {tab === 2 && (
        <div className="space-y-3">
          {notes.map((n, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:border-teal-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ClipboardList size={18} className="text-sky-600"/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-slate-800">Consultation Note</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={11}/>{n.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                      <User size={11}/>{n.doctor} · {n.specialty}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{n.note}</p>
                    <div className="flex items-center gap-2">
                      <BlockchainBadge />
                      <span className="text-[11px] text-slate-400 font-medium">· Cannot be altered</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([`Consultation Note — ${n.date}\nDoctor: ${n.doctor}\n\n${n.note}`], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Note-${n.date}.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition text-slate-600 opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <Download size={13}/> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
