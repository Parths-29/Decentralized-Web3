import { ArrowLeft, User, Shield, Bell, Link, Globe, Trash2, ChevronRight, Check, X, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${value ? 'bg-sky-500' : 'bg-slate-200'}`}>
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-6' : 'left-1'}`}/>
  </button>
)

const SectionHeader = ({ icon, label }) => (
  <div className="px-5 py-3 border-b border-slate-50">
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">{icon} {label}</div>
  </div>
)

const PwInput = ({ field, placeholder, pw, setPw, showPw, setShowPw, setPwError }) => (
  <div className="relative">
    <input
      type={showPw[field] ? 'text' : 'password'}
      placeholder={placeholder}
      value={pw[field]}
      onChange={e => { setPwError(''); setPw(p => ({ ...p, [field]: e.target.value })) }}
      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-sky-400 transition"
    />
    <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
      {showPw[field] ? <EyeOff size={15}/> : <Eye size={15}/>}
    </button>
  </div>
)

export default function Settings() {
  const nav = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [aiAlerts, setAiAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [twoFA, setTwoFA] = useState(true)
  const [editing, setEditing] = useState(false)

  // Change password state
  const [showPwModal, setShowPwModal] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Dr. Riya Sharma',
    email: 'riya.sharma@aiims.edu',
    department: 'Cardiology',
    hospital: 'AIIMS Mumbai',
  })
  const [draft, setDraft] = useState({ ...profile })
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  // Delete account state — step: null | 'confirm' | 'password' | 'deleted'
  const [deleteStep, setDeleteStep] = useState(null)
  const [deletePw, setDeletePw] = useState('')
  const [showDeletePw, setShowDeletePw] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const rules = [
    { label: 'At least 8 characters',          test: v => v.length >= 8 },
    { label: 'One uppercase letter (A-Z)',       test: v => /[A-Z]/.test(v) },
    { label: 'One lowercase letter (a-z)',       test: v => /[a-z]/.test(v) },
    { label: 'One number (0-9)',                 test: v => /[0-9]/.test(v) },
    { label: 'One special character (!@#$...)',  test: v => /[^A-Za-z0-9]/.test(v) },
  ]
  const allRulesPassed = rules.every(r => r.test(pw.newPw))

  const handlePwSave = () => {
    setPwError('')
    if (!pw.current) return setPwError('Please enter your current password.')
    if (!allRulesPassed) return setPwError('New password does not meet all requirements.')
    if (pw.newPw !== pw.confirm) return setPwError('Passwords do not match. Please re-enter.')
    setPwSuccess(true)
    setTimeout(() => {
      setShowPwModal(false)
      setPw({ current: '', newPw: '', confirm: '' })
      setPwSuccess(false)
      setPwError('')
    }, 1800)
  }

  const closePwModal = () => {
    setShowPwModal(false)
    setPw({ current: '', newPw: '', confirm: '' })
    setPwError('')
  }

  const handleDeleteConfirm = () => {
    setDeleteError('')
    if (!deletePw) return setDeleteError('Please enter your password to confirm.')
    // Simulate password check — in real app, verify against backend
    setDeleteStep('deleted')
    setTimeout(() => nav('/'), 2500)
  }

  const closeDeleteModal = () => {
    setDeleteStep(null)
    setDeletePw('')
    setDeleteError('')
    setShowDeletePw(false)
  }

  return (
    <div className="p-7">

      {/* ── Change Password Modal ── */}
      {showPwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <div className="font-heading font-bold text-slate-800 text-base">Change Password</div>
                <div className="text-xs text-slate-400 mt-0.5">Keep your account secure</div>
              </div>
              <button onClick={closePwModal}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                <X size={14} className="text-slate-400"/>
              </button>
            </div>
            {pwSuccess ? (
              <div className="px-6 py-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-emerald-500"/>
                </div>
                <div className="font-semibold text-slate-800">Password Updated!</div>
                <div className="text-xs text-slate-400">Your password has been changed successfully.</div>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Current Password</label>
                  <PwInput field="current" placeholder="Enter current password" pw={pw} setPw={setPw} showPw={showPw} setShowPw={setShowPw} setPwError={setPwError}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">New Password</label>
                  <PwInput field="newPw" placeholder="Enter new password" pw={pw} setPw={setPw} showPw={showPw} setShowPw={setShowPw} setPwError={setPwError}/>
                  {pw.newPw.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 p-3 bg-slate-50 rounded-lg">
                      {rules.map(r => (
                        <div key={r.label} className={`flex items-center gap-2 text-xs ${r.test(pw.newPw) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {r.test(pw.newPw) ? <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0"/> : <XCircle size={13} className="text-slate-300 flex-shrink-0"/>}
                          {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Confirm New Password</label>
                  <PwInput field="confirm" placeholder="Re-enter new password" pw={pw} setPw={setPw} showPw={showPw} setShowPw={setShowPw} setPwError={setPwError}/>
                  {pw.confirm.length > 0 && pw.newPw.length > 0 && (
                    <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${pw.confirm === pw.newPw ? 'text-emerald-600' : 'text-red-500'}`}>
                      {pw.confirm === pw.newPw ? <><CheckCircle2 size={12}/> Passwords match</> : <><XCircle size={12}/> Passwords do not match</>}
                    </div>
                  )}
                </div>
                {pwError && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                    <XCircle size={13} className="flex-shrink-0"/> {pwError}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button onClick={handlePwSave} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white gradient-bg hover:opacity-90 transition">
                    Update Password
                  </button>
                  <button onClick={closePwModal} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Account Modal ── */}
      {deleteStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">

            {/* Step 1: Confirm */}
            {deleteStep === 'confirm' && (
              <>
                <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertTriangle size={26} className="text-red-500"/>
                  </div>
                  <div className="font-heading font-bold text-slate-800 text-base mb-1">Delete Account?</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    This will <span className="font-semibold text-red-500">permanently delete</span> your account, all patient records, prescriptions, and blockchain data. <br/>
                    <span className="font-semibold">This action cannot be undone.</span>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-2">
                  <button onClick={closeDeleteModal}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                    No, Keep Account
                  </button>
                  <button onClick={() => setDeleteStep('password')}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition">
                    Yes, Delete
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Password */}
            {deleteStep === 'password' && (
              <>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="font-heading font-bold text-slate-800 text-base">Confirm Your Identity</div>
                    <div className="text-xs text-slate-400 mt-0.5">Enter your password to proceed</div>
                  </div>
                  <button onClick={closeDeleteModal}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                    <X size={14} className="text-slate-400"/>
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-red-600">Once deleted, your account <strong>cannot be recovered</strong>. All data will be permanently erased.</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Your Password</label>
                    <div className="relative">
                      <input
                        type={showDeletePw ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={deletePw}
                        onChange={e => { setDeleteError(''); setDeletePw(e.target.value) }}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-red-400 transition"
                      />
                      <button type="button" onClick={() => setShowDeletePw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showDeletePw ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                    {deleteError && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                        <XCircle size={12}/> {deleteError}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={closeDeleteModal}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
                      Cancel
                    </button>
                    <button onClick={handleDeleteConfirm}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition">
                      Delete Forever
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Deleted */}
            {deleteStep === 'deleted' && (
              <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 size={24} className="text-red-500"/>
                </div>
                <div className="font-semibold text-slate-800">Account Deleted</div>
                <div className="text-xs text-slate-400">Your account has been permanently deleted.<br/>Redirecting you to home...</div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors">
          <ArrowLeft size={15}/> Back
        </button>
        <div>
          <h1 className="font-heading text-xl font-bold text-slate-800">Settings</h1>
          <p className="text-xs text-slate-400">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* LEFT COLUMN */}
        <div className="space-y-5">

          {/* Profile */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<User size={14}/>} label="Profile" />
            <div className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">DR</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800">{profile.name}</div>
                <div className="text-sm text-slate-400">{profile.department} · {profile.hospital}</div>
                <div className="text-xs text-slate-400 mt-0.5">DR-2024-0042</div>
              </div>
              {!editing ? (
                <button onClick={() => { setDraft({...profile}); setEditing(true); }}
                  className="text-xs text-sky-500 hover:text-sky-700 font-medium flex items-center gap-1 flex-shrink-0">
                  Edit <ChevronRight size={12}/>
                </button>
              ) : (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setProfile({...draft}); setEditing(false); }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium">
                    <Check size={11}/> Save
                  </button>
                  <button onClick={() => { setDraft({...profile}); setEditing(false); }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition font-medium">
                    <X size={11}/> Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-slate-50 divide-y divide-slate-50">
              {[['Full Name','name'],['Email','email'],['Department','department'],['Hospital','hospital']].map(([label, key]) => (
                <div key={key} className="flex justify-between items-center px-5 py-3 gap-4">
                  <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
                  {editing ? (
                    <input value={draft[key]} onChange={e => setDraft(d => ({...d, [key]: e.target.value}))}
                      className="text-sm font-medium text-slate-700 text-right bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1 w-full max-w-xs focus:outline-none focus:border-sky-400 transition"/>
                  ) : (
                    <span className="text-sm font-medium text-slate-700 text-right">{profile[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Shield size={14}/>} label="Security" />
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
                  <div className="text-xs text-slate-400">Last changed 30 days ago</div>
                </div>
                <button onClick={() => setShowPwModal(true)}
                  className="text-xs text-sky-500 hover:text-sky-700 font-medium flex items-center gap-1">
                  Update <ChevronRight size={12}/>
                </button>
              </div>
              <div className="flex justify-between items-center px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-slate-700">Active Sessions</div>
                  <div className="text-xs text-slate-400">2 devices logged in</div>
                </div>
                <button className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                  Manage <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Bell size={14}/>} label="Notifications" />
            <div className="divide-y divide-slate-50">
              {[
                ['Push Notifications','Receive alerts on your device', notifications, setNotifications],
                ['AI Alerts','Drug interactions and risk warnings', aiAlerts, setAiAlerts],
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
            <SectionHeader icon={<Link size={14}/>} label="Blockchain" />
            <div className="divide-y divide-slate-50">
              {[['Wallet Address','0xA7f2...c831'],['Network','Ethereum Mainnet'],['Records On-chain','14,822']].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-5 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-mono font-medium text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <SectionHeader icon={<Globe size={14}/>} label="Preferences" />
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
              <div className="flex justify-between items-center px-5 py-3">
                <span className="text-sm text-slate-500">Timezone</span>
                <span className="text-sm font-medium text-slate-700">IST (UTC+5:30)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Danger Zone */}
        <div className="col-span-2 bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-5 py-2.5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trash2 size={14} className="text-red-400"/>
              <div>
                <div className="text-sm font-semibold text-red-500">Delete Account</div>
                <div className="text-xs text-slate-400">Permanently remove your account and all data</div>
              </div>
            </div>
            <button onClick={() => setDeleteStep('confirm')}
              className="text-xs px-4 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition font-medium flex-shrink-0">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
