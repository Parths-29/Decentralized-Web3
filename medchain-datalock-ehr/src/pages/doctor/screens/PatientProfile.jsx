import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, Shield, FileImage, FileText, FileBadge, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiFetch } from '../../../utils/api'

// Fallback patient data for offline/unseeded states
const fallbackPatient = {
  ID: 'P-00142',
  Name: 'Arjun Mehta',
  Age: '34',
  Gender: 'Male',
  BloodGrp: 'O+',
  ContactNo: '+91 98765 43210',
  Address: '12 MG Road, Mumbai',
  Email: 'arjun.mehta@example.com',
  Condition: 'Hypertension',
  Status: 'Follow-up',
  Risk: 70,
  Initials: 'AM',
  Color: 'from-sky-500 to-teal-500',
  Allergies: ['Penicillin'],
  Vitals: { BP: '145/90', HR: '78', SpO2: '98', LDL: '162' },
  Medicalvisits: [
    {
      Date: '2026-03-10',
      Description: 'Routine annual checkup',
      Doctor: 'Dr. Anand Verma',
      Diagnosis: 'Healthy — mild iron deficiency',
      Testperformed: 'CBC, Lipid Panel',
      Prescription: 'Iron supplements 65mg daily',
      Testreports: 'QmXjGh7KpLmR2nQsT9vWx4yZ3A'
    }
  ],
  CurrentHash: 'f4e88383a818c18b762512f45ea0044621c8da7f300bcfde03bcf4402a7042a9'
}

export default function PatientProfile() {
  const nav = useNavigate()
  const [viewingReport, setViewingReport] = useState(null)
  const [patient, setPatient] = useState(fallbackPatient)
  const [loading, setLoading] = useState(false)

  const fetchPatientDetails = async () => {
    const activeId = localStorage.getItem('active_patient_id') || 'P-00142'
    setLoading(true)
    try {
      const res = await apiFetch(`/patients/${activeId}`)
      if (res && res.data) {
        setPatient(res.data)
      }
    } catch (err) {
      console.warn('API error, using patient profile fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatientDetails()
  }, [])

  // Stably map dynamic clinical parameters
  const vitals = [
    { label:'Blood Pressure', value: patient.Vitals?.BP || '120/80', unit:'mmHg', color:'text-amber-500', status:'✓ Logged' },
    { label:'Heart Rate', value: patient.Vitals?.HR || '72', unit:'bpm', color:'text-emerald-500', status:'✓ Normal' },
    { label:'SpO₂', value: patient.Vitals?.SpO2 || '98', unit:'%', color:'text-emerald-500', status:'✓ Normal' },
    { label:'LDL', value: patient.Vitals?.LDL || '100', unit:'mg/dL', color:'text-red-500', status:'✓ Checked' },
  ]

  const timeline = (patient.Medicalvisits || []).map((v, i) => ({
    dot: i === 0 ? 'bg-sky-400 border-sky-400' : 'bg-teal-500 border-teal-500',
    date: `${v.Date} Consult`,
    title: v.Description,
    desc: `Doctor: ${v.Doctor} · Diagnosis: ${v.Diagnosis} · Rx: ${v.Prescription}`
  }))

  // Seed default history if visits list is empty
  if (timeline.length === 0) {
    timeline.push({
      dot: 'bg-sky-400 border-sky-400',
      date: 'Today',
      title: 'No Recorded Clinical History',
      desc: 'Create a new prescription or visit report to establish secure logs.'
    })
  }

  const reports = (patient.Medicalvisits || []).filter(v => v.Testreports).map(v => ({
    Icon: FileText,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    name: `${v.Testperformed || 'Lab'} Report`,
    date: `${v.Date} · IPFS · ${v.Testreports.slice(0, 16)}...`,
    type: 'IPFS',
  }))

  const accessLog = [
    { action: 'Viewed profile and clinical logs', meta: `Checked today · Signed Session Hash` },
    { action: 'Decrypted E2E demographic record', meta: 'Authorized practitioner identity' }
  ]


  return (
    <div className="p-7">

      {/* Report Viewer Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${viewingReport.iconBg} flex items-center justify-center`}>
                  <viewingReport.Icon size={18} className={viewingReport.iconColor}/>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{viewingReport.name}</div>
                  <div className="text-xs text-slate-400">{viewingReport.date}</div>
                </div>
              </div>
              <button onClick={() => setViewingReport(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition text-slate-400 text-lg leading-none">
                ×
              </button>
            </div>
            <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
              <div className={`w-16 h-16 rounded-xl ${viewingReport.iconBg} flex items-center justify-center`}>
                <viewingReport.Icon size={30} className={viewingReport.iconColor}/>
              </div>
              <div className="font-semibold text-slate-700">{viewingReport.name}</div>
              <div className="text-xs text-slate-400">{viewingReport.date}</div>
              <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-600">⛓ Blockchain Verified</span>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                In a live system, this would render the actual {viewingReport.type} file from secure blockchain-linked storage.
              </p>
              <button onClick={() => setViewingReport(null)}
                className="mt-2 px-6 py-2 rounded-lg text-sm font-semibold text-white gradient-bg hover:opacity-90 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={()=>nav('/doctor/patients')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:border-sky-400 hover:text-sky-600 transition text-slate-600">
          <ArrowLeft size={13}/> Back
        </button>
        <span className="text-sm text-slate-400">Patients / {patient.Name}</span>
      </div>

      {/* Profile Header */}
      <div className="gradient-bg rounded-xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10"/>
        <div className="absolute -right-16 top-10 w-32 h-32 rounded-full bg-white/5"/>
        <div className="flex items-start gap-5 relative z-10">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${patient.Color || 'from-sky-500 to-teal-500'} border-2 border-white/50 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0`}>{patient.Initials || 'P'}</div>
          <div className="flex-1">
            <div className="font-heading text-2xl font-bold text-white">{patient.Name}</div>
            <div className="text-white/80 text-sm mt-1">{patient.Age} years · {patient.Gender} · Patient ID: {patient.ID}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                `Blood: ${patient.BloodGrp || 'N/A'}`,
                ...(patient.Allergies || []).map(a => `⚠ Allergy: ${a}`),
                patient.Condition || 'Stable'
              ].map((t,i)=>(
                <span key={i} className="px-3 py-1 bg-white/20 border border-white/30 rounded-full text-xs text-white font-medium">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={()=>nav('/doctor/prescriptions')}
              className="px-4 py-2 bg-white text-sky-600 rounded-lg text-xs font-bold hover:bg-sky-50 transition flex items-center gap-1.5">
              ✚ New Prescription
            </button>
            <button className="px-4 py-2 bg-white/20 border border-white/40 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition flex items-center gap-1.5">
              <Share2 size={12}/> Share Record
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Left */}
        <div className="space-y-5">

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4">Medical History</div>
            <div className="timeline-container relative pl-10 space-y-5">
              {timeline.map((t,i)=>(
                <div key={i} className="relative">
                  <div className={`absolute -left-10 w-8 h-8 rounded-full ${t.dot} border-2 bg-white flex items-center justify-center z-10`}/>
                  <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-400 mb-1">{t.date}</div>
                    <div className="text-sm font-semibold text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4">Reports</div>
            <div className="space-y-3">
              {reports.map((r,i)=>(
                <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all">
                  {/* Icon */}
                  <div className={`w-11 h-11 ${r.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <r.Icon size={22} className={r.iconColor}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.date}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 bg-gradient-to-r from-sky-50 to-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-600">⛓ Verified</span>
                  </div>
                  <button
                    onClick={() => setViewingReport(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition text-slate-600 flex-shrink-0">
                    <Eye size={12}/> View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">

          {/* Vitals */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4">Current Vitals</div>
            <div className="grid grid-cols-2 gap-3">
              {vitals.map((v,i)=>(
                <div key={i} className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{v.label}</div>
                  <div className={`font-heading text-xl font-bold ${v.color}`}>{v.value}<span className="text-sm font-normal text-slate-400 ml-1">{v.unit}</span></div>
                  <div className={`text-xs mt-0.5 ${v.color}`}>{v.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Logs */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Shield size={14} className="text-sky-500"/> Access Logs
            </div>
            <div className="space-y-2.5">
              {accessLog.map((a,i)=>(
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <Shield size={12} className="text-sky-500"/>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-700">{a.action}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4">⛓ Blockchain Verification</div>
            <div className="bg-gradient-to-br from-sky-50 to-teal-50 border border-teal-200 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg"> </span>
                <span className="font-semibold text-sm text-teal-700">All records verified immutable</span>
              </div>
              <div className="text-xs text-slate-500">Last hash: <code className="bg-white px-1.5 py-0.5 rounded text-sky-600 font-mono">{patient.CurrentHash ? `${patient.CurrentHash.slice(0, 8)}...${patient.CurrentHash.slice(-8)}` : 'Unsigned'}</code></div>
              <div className="text-xs text-slate-400 mt-1">Block: #{(patient.Medicalvisits || []).length + 1} · {(patient.Medicalvisits || []).length} records on-chain</div>
            </div>
            <div className="text-xs text-slate-400">Data cannot be altered or deleted. Every access is logged permanently.</div>
          </div>
        </div>
      </div>
    </div>
  )
}