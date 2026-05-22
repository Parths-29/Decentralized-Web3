import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Home, FileText, Pill, Bot, Lock, Search, LogOut, Bell, X, Link2, Settings as SettingsIcon } from 'lucide-react'
import PatientDashboard from './screens/PatientDashboard'
import PatientRecords from './screens/PatientRecords'
import PatientMedicines from './screens/PatientMedicines'
import PatientAI from './screens/PatientAI'
import PatientConsent from './screens/PatientConsent'
import PatientLogs from './screens/PatientLogs'
import PatientEmergency from './screens/PatientEmergency'
import PatientNotifications from './screens/PatientNotifications'
import PatientSettings from './screens/PatientSettings'

const NAV = [
  { label: 'Home',      icon: <Home size={17}/>,     path: 'dashboard', section: 'Main' },
  { label: 'Records',   icon: <FileText size={17}/>,  path: 'records',   section: 'Main' },
  { label: 'Medicines', icon: <Pill size={17}/>,      path: 'medicines', section: 'Main' },
  { label: 'AI',        icon: <Bot size={17}/>,       path: 'ai',        section: 'Intelligence' },
  { label: 'Consent',   icon: <Lock size={17}/>,      path: 'consent',   section: 'Security' },
  { label: 'Logs',      icon: <Search size={17}/>,    path: 'logs',      section: 'Security' },
]

const getRealDate = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut size={18} className="text-red-500"/>
            </div>
            <div className="font-semibold text-slate-800 text-sm">Sign Out</div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition">
            <X size={17}/>
          </button>
        </div>
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-600 mb-1">
            Are you sure you want to sign out, <span className="font-semibold text-slate-800">Arjun Mehta</span>?
          </p>
          <p className="text-xs text-slate-400">Your session will end and all unsaved changes may be lost.</p>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Session started</span>
              <span className="text-slate-600 font-medium">Today, 09:15 AM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Patient ID</span>
              <span className="text-slate-600 font-medium">P-00142</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Blockchain sync</span>
              <span className="text-teal-600 font-medium">✓ All saved</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            Stay Signed In
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-1.5">
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PatientApp() {
  const nav = useNavigate()
  const loc = useLocation()
  const current = loc.pathname.split('/')[2] || 'dashboard'
  const [showSignOut, setShowSignOut] = useState(false)

  const pageTitle = {
    dashboard:     'Dashboard',
    records:       'My Records',
    medicines:     'Medicines',
    ai:            'AI Assistant',
    consent:       'Consent Manager',
    logs:          'Access Logs',
    emergency:     'Emergency Info',
    notifications: 'Notifications',
    settings:      'Settings',
  }[current] || 'Dashboard'

  const sections = [...new Set(NAV.map(n => n.section))]

  return (
    <div className="flex min-h-screen bg-[#f0f9ff]">

      {showSignOut && (
        <SignOutModal
          onConfirm={() => { setShowSignOut(false); nav('/') }}
          onCancel={() => setShowSignOut(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col fixed top-0 left-0 h-screen z-50 shadow-sm">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
            <Link2 size={16} color="white"/>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Med<span className="text-teal-500">Chain</span>.ai
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {sections.map(sec => (
            <div key={sec}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mt-5 mb-1.5 first:mt-0">{sec}</div>
              {NAV.filter(n => n.section === sec).map(item => {
                const active = current === item.path
                return (
                  <button key={item.path} onClick={() => nav(`/patient/${item.path}`)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${
                      active
                        ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 font-semibold'
                        : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                    }`}>
                    <span className={active ? 'text-teal-600' : 'text-slate-400'}>{item.icon}</span>
                    {item.label}
                  </button>
                )
              })}
            </div>
          ))}

          <div className="mt-4">
            <button onClick={() => setShowSignOut(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all">
              <LogOut size={17} className="text-slate-400"/> Sign Out
            </button>
          </div>
        </nav>

        {/* User Footer */}
        <div className="px-4 py-3.5 border-t border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>AM</div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Arjun Mehta</div>
            <div className="text-xs text-slate-400">Patient · P-00142</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-60 flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-7 py-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-lg font-semibold text-slate-800">{pageTitle}</div>
            <div className="text-xs text-slate-400">{getRealDate()}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-600 border border-teal-200 bg-teal-50">
              <Link2 size={12}/> Blockchain: Live
            </div>

            {/* ✅ FIX: Bell button — onClick navigate to notifications */}
            <button
              onClick={() => nav('/patient/notifications')}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition relative ${
                current === 'notifications'
                  ? 'bg-teal-50 border-teal-300'
                  : 'border-slate-200 hover:bg-teal-50'
              }`}>
              <Bell size={16} className={current === 'notifications' ? 'text-teal-600' : 'text-slate-500'}/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
            </button>

            {/* ✅ FIX: Settings button — onClick navigate to settings */}
            <button
              onClick={() => nav('/patient/settings')}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                current === 'settings'
                  ? 'bg-teal-50 border-teal-300'
                  : 'border-slate-200 hover:bg-teal-50'
              }`}>
              <SettingsIcon size={16} className={current === 'settings' ? 'text-teal-600' : 'text-slate-500'}/>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          <Routes>
            <Route path="dashboard"     element={<PatientDashboard />} />
            <Route path="records"       element={<PatientRecords />} />
            <Route path="medicines"     element={<PatientMedicines />} />
            <Route path="ai"            element={<PatientAI />} />
            <Route path="consent"       element={<PatientConsent />} />
            <Route path="logs"          element={<PatientLogs />} />
            <Route path="emergency"     element={<PatientEmergency />} />
            <Route path="notifications" element={<PatientNotifications />} />
            <Route path="settings"      element={<PatientSettings />} />
            <Route path="*"             element={<Navigate to="dashboard"/>} />
          </Routes>
        </div>

      </div>
    </div>
  )
}
