import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Upload, Bot, Shield, Settings as SettingsIcon, LogOut, Bell, X } from 'lucide-react'
import Dashboard from './screens/Dashboard'
import Patients from './screens/Patients'
import PatientProfile from './screens/PatientProfile'
import Prescriptions from './screens/Prescriptions'
import AIAssistant from './screens/AIAssistant'
import UploadReports from './screens/UploadReports'
import AuditLogs from './screens/AuditLogs'
import Notifications from './screens/Notifications'
import SettingsPage from './screens/Settings'

const NAV = [
  { label:'Dashboard', icon:<LayoutDashboard size={17}/>, path:'dashboard', section:'Main' },
  { label:'Patients', icon:<Users size={17}/>, path:'patients', section:'Main', badge:12 },
  { label:'Prescriptions', icon:<FileText size={17}/>, path:'prescriptions', section:'Main' },
  { label:'Upload Reports', icon:<Upload size={17}/>, path:'upload', section:'Main' },
  { label:'AI Assistant', icon:<Bot size={17}/>, path:'ai', section:'Intelligence' },
  { label:'Audit Logs', icon:<Shield size={17}/>, path:'audit', section:'Security' },
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
            Are you sure you want to sign out, <span className="font-semibold text-slate-800">Dr. Riya Sharma</span>?
          </p>
          <p className="text-xs text-slate-400">Your session will end and all unsaved changes may be lost.</p>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Session started</span>
              <span className="text-slate-600 font-medium">Today, 09:15 AM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Active patients</span>
              <span className="text-slate-600 font-medium">3 open cases</span>
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

export default function DoctorApp() {
  const nav = useNavigate()
  const loc = useLocation()
  const current = loc.pathname.split('/')[2] || 'dashboard'
  const [showSignOut, setShowSignOut] = useState(false)

  const pageTitle = {
    dashboard:'Dashboard', patients:'Patients', prescriptions:'Prescriptions',
    upload:'Upload Reports', ai:'AI Assistant', audit:'Audit Logs',
    profile:'Patient Profile', notifications:'Notifications', settings:'Settings'
  }[current] || 'Dashboard'

  const sections = [...new Set(NAV.map(n=>n.section))]

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
        <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-sm">⛓️</div>
          <span className="font-heading text-lg font-bold">Med<span className="text-sky-500">Chain</span>.ai</span>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {sections.map(sec=>(
            <div key={sec}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mt-5 mb-1.5 first:mt-0">{sec}</div>
              {NAV.filter(n=>n.section===sec).map(item=>{
                const active = current===item.path || (current==='profile'&&item.path==='patients')
                return (
                  <button key={item.path} onClick={()=>nav(`/doctor/${item.path}`)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${active
                      ?'bg-gradient-to-r from-sky-50 to-teal-50 text-sky-700 font-semibold'
                      :'text-slate-500 hover:bg-sky-50 hover:text-sky-600'}`}>
                    <span className={active?'text-sky-600':'text-slate-400'}>{item.icon}</span>
                    {item.label}
                    {item.badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{item.badge}</span>}
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

        <div className="px-4 py-3.5 border-t border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">DR</div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Dr. Riya Sharma</div>
            <div className="text-xs text-slate-400">Cardiologist · AIIMS Mumbai</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col">
        <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-7 py-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="font-heading text-lg font-semibold text-slate-800">{pageTitle}</div>
            {/* Real-time date — always shows today's actual date */}
            <div className="text-xs text-slate-400">{getRealDate()}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-600 border border-teal-200 bg-teal-50">
              ⛓️ Blockchain: Live
            </div>
            <button onClick={()=>nav('/doctor/notifications')}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-sky-50 transition relative">
              <Bell size={16} className="text-slate-500"/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={()=>nav('/doctor/settings')}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-sky-50 transition">
              <SettingsIcon size={16} className="text-slate-500"/>
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="upload" element={<UploadReports />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard"/>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
