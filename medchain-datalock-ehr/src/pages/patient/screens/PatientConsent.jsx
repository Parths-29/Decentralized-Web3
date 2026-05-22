import { useState } from 'react'
import {
  ShieldCheck, UserRound, Building2, ShieldOff, Calendar,
  Plus, X, CheckCircle2, AlertTriangle, Lock, Unlock, ChevronRight, Link2
} from 'lucide-react'

const initialConsents = [
  {
    id: 1,
    type: 'doctor',
    name: 'Dr. Riya Sharma',
    sub: 'AIIMS Mumbai · Cardiologist',
    expires: '30 May 2026',
    tags: ['Full Records', 'Prescriptions'],
    active: true,
    revoked: false,
  },
  {
    id: 2,
    type: 'lab',
    name: 'Apollo Diagnostics Lab',
    sub: 'Lab Report uploads only',
    expires: '15 May 2026',
    tags: ['Upload Only'],
    active: true,
    revoked: false,
  },
  {
    id: 3,
    type: 'doctor',
    name: 'Dr. Anand Joshi',
    sub: 'AIIMS Mumbai · Neurologist',
    expires: null,
    tags: [],
    active: false,
    revoked: true,
  },
]

const tagStyle = {
  'Full Records':  'bg-sky-50 text-sky-600 border-sky-100',
  'Prescriptions': 'bg-teal-50 text-teal-600 border-teal-100',
  'Upload Only':   'bg-violet-50 text-violet-600 border-violet-100',
  'Lab Reports':   'bg-amber-50 text-amber-600 border-amber-100',
}

function ConfirmModal({ consent, action, onConfirm, onCancel }) {
  const isRevoking = action === 'revoke'
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isRevoking ? 'bg-red-50' : 'bg-emerald-50'}`}>
              {isRevoking ? <ShieldOff size={18} className="text-red-500"/> : <ShieldCheck size={18} className="text-emerald-500"/>}
            </div>
            <div className="font-semibold text-slate-800 text-sm">
              {isRevoking ? 'Revoke Access' : 'Grant Access'}
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition">
            <X size={17}/>
          </button>
        </div>
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-600 mb-4">
            {isRevoking
              ? <>Are you sure you want to revoke access for <span className="font-semibold text-slate-800">{consent.name}</span>? They will no longer be able to view your records.</>
              : <>Re-grant access to <span className="font-semibold text-slate-800">{consent.name}</span>? They will regain access to your shared records.</>
            }
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Provider</span>
              <span className="text-slate-700 font-medium">{consent.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Recorded on</span>
              <span className="text-teal-600 font-medium flex items-center gap-1"><Link2 size={10}/> Blockchain</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              Cancel
            </button>
            <button onClick={onConfirm}
              className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition flex items-center justify-center gap-1.5 ${
                isRevoking ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}>
              {isRevoking ? <><ShieldOff size={14}/> Revoke</> : <><ShieldCheck size={14}/> Grant</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GrantModal({ onGrant, onCancel }) {
  const [form, setForm] = useState({ name: '', sub: '', expires: '', tags: [] })
  const allTags = ['Full Records', 'Prescriptions', 'Upload Only', 'Lab Reports']
  const toggleTag = (t) => setForm(f => ({
    ...f,
    tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t]
  }))
  const valid = form.name.trim() && form.expires && form.tags.length > 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Plus size={16} className="text-teal-500"/>
            <span className="font-semibold text-slate-800 text-sm">Grant New Access</span>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={17}/></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctor / Lab Name</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 transition"
              placeholder="Dr. Name or Lab"/>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Speciality / Details</label>
            <input value={form.sub} onChange={e => setForm(f => ({...f, sub: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 transition"
              placeholder="AIIMS Mumbai · Cardiologist"/>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
            <input type="date" value={form.expires} onChange={e => setForm(f => ({...f, expires: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 transition"/>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Access Permissions</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(t => (
                <button key={t} onClick={() => toggleTag(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    form.tags.includes(t)
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-teal-300'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => valid && onGrant(form)}
            className={`w-full py-2.5 text-sm font-semibold text-white rounded-xl transition flex items-center justify-center gap-2 ${
              valid ? 'opacity-100 hover:-translate-y-0.5' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ background: 'linear-gradient(135deg,#0d9488,#06b6d4)' }}>
            <ShieldCheck size={15}/> Grant Access
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PatientConsent() {
  const [consents, setConsents] = useState(initialConsents)
  const [confirm, setConfirm] = useState(null)   // { index, action }
  const [showGrant, setShowGrant] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleToggle = (i) => {
    const c = consents[i]
    setConfirm({ index: i, action: c.active ? 'revoke' : 'grant' })
  }

  const handleConfirm = () => {
    const { index, action } = confirm
    setConsents(prev => prev.map((c, i) =>
      i === index
        ? { ...c, active: action === 'grant', revoked: action === 'revoke' }
        : c
    ))
    showToast(
      action === 'revoke'
        ? `Access revoked for ${consents[index].name}`
        : `Access granted to ${consents[index].name}`,
      action === 'revoke' ? 'warn' : 'success'
    )
    setConfirm(null)
  }

  const handleGrant = (form) => {
    const d = new Date(form.expires)
    const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    setConsents(prev => [...prev, {
      id: Date.now(),
      type: 'doctor',
      name: form.name,
      sub: form.sub || 'New provider',
      expires: dateStr,
      tags: form.tags,
      active: true,
      revoked: false,
    }])
    setShowGrant(false)
    showToast(`Access granted to ${form.name}`, 'success')
  }

  const active  = consents.filter(c => c.active && !c.revoked)
  const revoked = consents.filter(c => c.revoked)

  return (
    <div className="p-7 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}
          {toast.msg}
        </div>
      )}

      {confirm && (
        <ConfirmModal
          consent={consents[confirm.index]}
          action={confirm.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {showGrant && (
        <GrantModal
          onGrant={handleGrant}
          onCancel={() => setShowGrant(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Consent Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">Control who can access your medical data</p>
        </div>
        <button onClick={() => setShowGrant(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all"
          style={{ background: 'linear-gradient(135deg,#0d9488,#06b6d4)' }}>
          <Plus size={15}/> Grant New Access
        </button>
      </div>

      {/* Blockchain Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-50 to-teal-50 border border-teal-200 rounded-xl">
        <ShieldCheck size={18} className="text-teal-500 flex-shrink-0 mt-0.5"/>
        <div>
          <div className="text-sm font-semibold text-teal-700 mb-0.5">Consent stored on blockchain</div>
          <div className="text-xs text-slate-500">All permissions are cryptographically signed and immutable. You can revoke anytime.</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <Unlock size={18} className="text-emerald-500 flex-shrink-0"/>
          <div>
            <div className="text-xl font-bold text-emerald-600">{active.length}</div>
            <div className="text-xs text-emerald-600 font-medium">Active Access</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <Lock size={18} className="text-red-400 flex-shrink-0"/>
          <div>
            <div className="text-xl font-bold text-red-400">{revoked.length}</div>
            <div className="text-xs text-red-400 font-medium">Revoked</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-sky-50 border border-sky-100 rounded-xl">
          <Link2 size={18} className="text-sky-500 flex-shrink-0"/>
          <div>
            <div className="text-xl font-bold text-sky-600">{consents.length}</div>
            <div className="text-xs text-sky-600 font-medium">Total Records</div>
          </div>
        </div>
      </div>

      {/* Consent Cards */}
      <div className="space-y-3">
        {consents.map((c, i) => (
          <div key={c.id}
            className={`flex items-center gap-4 p-5 bg-white rounded-xl border shadow-sm transition-all
              ${c.revoked ? 'opacity-60 border-slate-100' : 'border-slate-100 hover:border-teal-200 hover:shadow-md'}`}>

            {/* Avatar */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              c.type === 'lab' ? 'bg-violet-50' : 'bg-sky-50'
            }`}>
              {c.type === 'lab'
                ? <Building2 size={20} className="text-violet-500"/>
                : <UserRound size={20} className="text-sky-500"/>
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm font-semibold ${c.revoked ? 'text-slate-400' : 'text-slate-800'}`}>{c.name}</span>
              </div>
              <div className="text-xs text-slate-400 mb-2">{c.sub}</div>

              {c.revoked ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                  <ShieldOff size={11}/> Access revoked
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-teal-600 mb-2">
                  <Calendar size={11}/> Expires: {c.expires}
                </div>
              )}

              {c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((t, j) => (
                    <span key={j} className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tagStyle[t] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => handleToggle(i)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${c.active ? 'bg-teal-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${c.active ? 'translate-x-6' : 'translate-x-0.5'}`}/>
              </button>
              <ChevronRight size={15} className="text-slate-300"/>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}