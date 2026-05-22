import { ArrowLeft, Bell, AlertTriangle, CheckCircle, Clock, Pill, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const initialNotifs = [
  { icon: <AlertTriangle size={16} className="text-amber-500"/>, title: 'BP Alert', desc: 'Your blood pressure reading is above normal range', time: '10:28 AM', bg: 'bg-amber-50', border: 'border-amber-200', unread: true },
  { icon: <Pill size={16} className="text-teal-500"/>, title: 'Medicine Reminder', desc: 'Metformin 500mg due at 1:00 PM', time: '12:45 PM', bg: 'bg-teal-50', border: 'border-teal-200', unread: true },
  { icon: <FileText size={16} className="text-sky-500"/>, title: 'New Report Available', desc: 'Lipid profile report uploaded by Apollo Diagnostics', time: 'Yesterday', bg: 'bg-sky-50', border: 'border-sky-200', unread: false },
  { icon: <CheckCircle size={16} className="text-emerald-500"/>, title: 'Prescription Updated', desc: 'Dr. Riya Sharma updated your prescription', time: 'Yesterday', bg: 'bg-emerald-50', border: 'border-emerald-200', unread: false },
  { icon: <Clock size={16} className="text-purple-500"/>, title: 'Appointment Reminder', desc: 'Follow-up with Dr. Sharma on 30 Apr 2026', time: '23 Apr', bg: 'bg-purple-50', border: 'border-purple-200', unread: false },
  { icon: <CheckCircle size={16} className="text-emerald-500"/>, title: 'Consent Granted', desc: 'Access granted to Dr. Riya Sharma · Expires 30 May', time: '20 Apr', bg: 'bg-emerald-50', border: 'border-emerald-200', unread: false },
]

export default function PatientNotifications() {
  const nav = useNavigate()
  const [notifs, setNotifs] = useState(initialNotifs)
  const unreadCount = notifs.filter(n => n.unread).length
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))
  const markRead = (i) => setNotifs(n => n.map((x, idx) => idx === i ? { ...x, unread: false } : x))

  return (
    <div className="p-7">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => nav(-1)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors">
          <ArrowLeft size={15}/> Back
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold text-slate-800">Notifications</h1>
          <p className="text-xs text-slate-400">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="text-xs text-teal-500 hover:text-teal-700 font-medium px-3 py-1.5 border border-teal-200 rounded-lg hover:bg-teal-50 transition">
            Mark all as read
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {notifs.map((n, i) => (
          <div key={i} onClick={() => markRead(i)}
            className={`flex items-start gap-4 p-4 rounded-xl border ${n.bg} ${n.border} transition-all hover:shadow-sm cursor-pointer relative`}>
            {n.unread && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-teal-500"/>}
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              {n.icon}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <div className={`text-sm text-slate-800 ${n.unread ? 'font-bold' : 'font-semibold'}`}>{n.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{n.desc}</div>
              <div className="text-xs text-slate-400 mt-1.5">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
