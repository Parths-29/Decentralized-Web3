import { ArrowLeft, User, Bell, Link2, Globe, Trash2, ChevronRight, Shield, X, Check, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${value ? 'bg-teal-500' : 'bg-slate-200'}`}>
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-6' : 'left-1'}`}/>
  </button>
)

const SectionHeader = ({ icon, label }) => (
  <div className="px-5 py-3 border-b border-slate-100">
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">{icon} {label}</div>
  </div>
)

function EditProfileModal({ profile, onSave, onCancel }) {
  const [form, setForm] = useState({ ...profile })
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
              <Pencil size={14} color="white"/>
            </div>
            <span className="font-semibold text-slate-800">Edit Profile</span>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition">
            <X size={17}/>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          {/* Avatar preview */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
              {form.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'AM'}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{form.name || 'Your Name'}</div>
              <div className="text-xs text-slate-400">Patient · P-00142</div>
            </div>
          </div>

          {[
            { label: 'Full Name',     key: 'name',  type: 'text',   placeholder: 'Arjun Mehta' },
            { label: 'Date of Birth', key: 'dob',   type: 'date',   placeholder: '' },
            { label: 'Blood Group',   key: 'blood', type: 'text',   placeholder: 'O+' },
            { label: 'Phone',         key: 'phone', type: 'tel',    placeholder: '+91-98765-43210' },
            { label: 'Email',         key: 'email', type: 'email',  placeholder: 'arjun.mehta@email.com' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
            style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
            <Check size={15}/> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PatientSettings() {
  const nav = useNavigate()

  const [profile, setProfile] = useState({
    name:  'Arjun Mehta',
    dob:   '1992-03-12',
    blood: 'O+',
    phone: '+91-98765-43210',
    email: 'arjun.mehta@email.com',
  })
  const [showEdit, setShowEdit]       = useState(false)
  const [savedToast, setSavedToast]   = useState(false)

  const [medReminders,  setMedReminders]  = useState(true)
  const [apptAlerts,    setApptAlerts]    = useState(true)
  const [reportNotifs,  setReportNotifs]  = useState(true)
  const [twoFA,         setTwoFA]         = useState(false)
  const [darkMode,      setDarkMode]      = useState(false)

  const handleSave = (updated) => {
    setProfile(updated)
    setShowEdit(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  const formatDob = (dob) => {
    if (!dob) return '—'
    const d = new Date(dob)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="p-7 bg-[#f0f9ff] min-h-screen">

      {/* Toast */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold bg-emerald-500 text-white animate-fade">
          <Check size={16}/> Profile saved successfully!
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onSave={handleSave}
          onCancel={() => setShowEdit(false)}
        />
      )}

      {/* Back + Title */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => nav(-1)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors">
          <ArrowLeft size={15}/> Back
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Settings</h1>
          <p className="text-xs text-slate-400">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* LEFT */}
        <div className="space-y-5">

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<User size={14}/>} label="Profile"/>

            <div className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
                {initials}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{profile.name}</div>
                <div className="text-sm text-slate-400">Patient · P-00142</div>
                <div className="text-xs text-slate-400 mt-0.5">{profile.email}</div>
              </div>
              {/* ✅ Edit button — now opens modal */}
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 text-xs text-teal-500 hover:text-teal-700 font-semibold px-3 py-1.5 border border-teal-200 rounded-lg hover:bg-teal-50 transition">
                <Pencil size={12}/> Edit
              </button>
            </div>

            <div className="border-t border-slate-50 divide-y divide-slate-50">
              {[
                ['Full Name',     profile.name],
                ['Date of Birth', formatDob(profile.dob)],
                ['Blood Group',   profile.blood],
                ['Phone',         profile.phone],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-5 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-medium text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Shield size={14}/>} label="Security"/>
            <div className="divide-y divide-slate-50">
              <div className="flex justify-between items-center px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-slate-700">Two-Factor Authentication</div>
                  <div className="text-xs text-slate-400">Extra security for your account</div>
                </div>
                <Toggle value={twoFA} onChange={setTwoFA}/>
              </div>
              <div className="flex justify-between items-center px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-slate-700">Change Password</div>
                  <div className="text-xs text-slate-400">Last changed 60 days ago</div>
                </div>
                <button className="text-xs text-teal-500 hover:text-teal-700 font-medium flex items-center gap-1">
                  Update <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Bell size={14}/>} label="Notifications"/>
            <div className="divide-y divide-slate-50">
              {[
                ['Medicine Reminders', 'Daily dose alerts',        medReminders, setMedReminders],
                ['Appointment Alerts', 'Upcoming visit reminders', apptAlerts,   setApptAlerts],
                ['Report Notifications','New reports uploaded',    reportNotifs, setReportNotifs],
              ].map(([label, desc, val, setter]) => (
                <div key={label} className="flex justify-between items-center px-5 py-4">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{label}</div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                  <Toggle value={val} onChange={setter}/>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Link2 size={14}/>} label="Blockchain"/>
            <div className="divide-y divide-slate-50">
              {[
                ['Wallet Address',   '0xB3d1...a492'],
                ['Network',          'Ethereum Mainnet'],
                ['Records On-chain', '8'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-5 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-mono font-medium text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Globe size={14}/>} label="Preferences"/>
            <div className="divide-y divide-slate-50">
              <div className="flex justify-between items-center px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-slate-700">Dark Mode</div>
                  <div className="text-xs text-slate-400">Switch interface theme</div>
                </div>
                <Toggle value={darkMode} onChange={setDarkMode}/>
              </div>
              <div className="flex justify-between items-center px-5 py-3">
                <span className="text-sm text-slate-500">Language</span>
                <span className="text-sm font-medium text-slate-700">English</span>
              </div>
            </div>
          </div>

        </div>

        {/* Danger Zone */}
        <div className="col-span-2 bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trash2 size={14} className="text-red-400"/>
              <div>
                <div className="text-sm font-semibold text-red-500">Delete Account</div>
                <div className="text-xs text-slate-400">Permanently remove your account and all health data</div>
              </div>
            </div>
            <button className="text-xs px-4 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition font-medium">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
