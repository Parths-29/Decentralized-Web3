import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Upload, Bot, Shield, Settings as SettingsIcon, LogOut, Bell, X, Menu } from 'lucide-react'
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
  { label:'Dashboard', icon:<LayoutDashboard size={20} strokeWidth={2}/>, path:'dashboard', section:'Main' },
  { label:'Patients', icon:<Users size={20} strokeWidth={2}/>, path:'patients', section:'Main', badge:12 },
  { label:'Prescriptions', icon:<FileText size={20} strokeWidth={2}/>, path:'prescriptions', section:'Main' },
  { label:'Upload', icon:<Upload size={20} strokeWidth={2}/>, path:'upload', section:'Main' },
  { label:'AI Assistant', icon:<Bot size={20} strokeWidth={2}/>, path:'ai', section:'Intelligence' },
  { label:'Audit Logs', icon:<Shield size={20} strokeWidth={2}/>, path:'audit', section:'Security' },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-premium-md w-full max-w-sm overflow-hidden animate-fade">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
              <LogOut size={18} className="text-red-500"/>
            </div>
            <div className="font-semibold text-slate-900 text-sm">Sign Out</div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={18}/>
          </button>
        </div>
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-600 mb-1">
            Are you sure you want to sign out, <span className="font-semibold text-slate-900">Dr. Riya Sharma</span>?
          </p>
          <p className="text-xs text-slate-500">Your session will end and all unsaved changes may be lost.</p>
          <div className="mt-4 p-3 bg-surface border border-slate-200/60 rounded-md space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Session started</span>
              <span className="text-slate-900 font-medium">Today, 09:15 AM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Active patients</span>
              <span className="text-slate-900 font-medium">3 open cases</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Blockchain sync</span>
              <span className="text-teal-600 font-medium flex items-center gap-1"><Check size={12}/> All saved</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            Sign Out
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
    <div className="flex min-h-screen bg-surface">

      {showSignOut && (
        <SignOutModal
          onConfirm={() => { setShowSignOut(false); nav('/') }}
          onCancel={() => setShowSignOut(false)}
        />
      )}

      {/* Desktop Sidebar (hidden on tablet/mobile) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/60 flex-col fixed top-0 left-0 h-screen z-50">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 text-sm">⛓️</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Med<span className="text-teal-600">Chain</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {sections.map(sec=>(
            <div key={sec} className="mb-6">
              <div className="text-label text-slate-400 px-3 mb-2">{sec}</div>
              {NAV.filter(n=>n.section===sec).map(item=>{
                const active = current===item.path || (current==='profile'&&item.path==='patients')
                return (
                  <button key={item.path} onClick={()=>nav(`/doctor/${item.path}`)}
                    className={`nav-link-bottom w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium mb-1 ${active
                      ?'text-teal-700 bg-teal-50'
                      :'text-slate-600 hover:text-slate-900'}`}>
                    <span className={active?'text-teal-600':'text-slate-400'}>{item.icon}</span>
                    {item.label}
                    {item.badge && <span className="ml-auto bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full px-2 py-0.5">{item.badge}</span>}
                  </button>
                )
              })}
            </div>
          ))}
          <div className="mt-2">
            <button onClick={() => setShowSignOut(true)}
              className="nav-link-bottom w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
              <LogOut size={20} strokeWidth={2} className="text-slate-400"/> Sign Out
            </button>
          </div>
        </nav>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-teal-700 text-sm font-bold shrink-0">RS</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">Dr. Riya Sharma</div>
            <div className="text-xs text-slate-500 truncate">Cardiologist</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 pb-20 md:pb-0">
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-h3 text-slate-900">{pageTitle}</h1>
            <div className="text-xs font-medium text-slate-500 mt-0.5">{getRealDate()}</div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Blockchain Sync Live
            </div>
            <button onClick={()=>nav('/doctor/notifications')}
              className="w-10 h-10 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors relative bg-white">
              <Bell size={18} strokeWidth={2} className="text-slate-600"/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={()=>nav('/doctor/settings')}
              className="hidden md:flex w-10 h-10 rounded-md border border-slate-200 items-center justify-center hover:bg-slate-50 transition-colors bg-white">
              <SettingsIcon size={18} strokeWidth={2} className="text-slate-600"/>
            </button>
          </div>
        </header>

        {/* Content Routes */}
        <main className="flex-1 p-4 md:p-8">
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
        </main>
      </div>

      {/* Mobile/Tablet Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/60 px-2 py-2 flex justify-around items-center z-50 pb-safe">
        {NAV.filter(n => ['dashboard', 'patients', 'ai', 'audit'].includes(n.path)).map(item => {
          const active = current === item.path || (current === 'profile' && item.path === 'patients');
          return (
            <button 
              key={item.path} 
              onClick={() => nav(`/doctor/${item.path}`)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${active ? 'text-teal-600' : 'text-slate-400'}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button 
          onClick={() => nav('/doctor/settings')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${current === 'settings' ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <SettingsIcon size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

    </div>
  )
}
