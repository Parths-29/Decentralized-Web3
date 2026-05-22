import { useNavigate } from 'react-router-dom'
import { Users, FileText, Bot, Zap, AlertTriangle, CheckCircle, Clock, Link, AlertCircle } from 'lucide-react'

const stats = [
  { label:'Total Patients', value:'248', change:'↑ +14 this week', icon:<Users size={22} className="text-sky-500"/>, cls:'stat-blue', chgColor:'text-emerald-500' },
  { label:'Pending Reports', value:'17', change:'⚠ 5 urgent', icon:<FileText size={22} className="text-teal-500"/>, cls:'stat-teal', chgColor:'text-amber-500' },
  { label:'AI Alerts', value:'6', change:'● 2 critical', icon:<Bot size={22} className="text-amber-500"/>, cls:'stat-amber', chgColor:'text-red-500' },
  { label:'Active Cases', value:'43', change:'↓ -3 resolved', icon:<Zap size={22} className="text-purple-500"/>, cls:'stat-purple', chgColor:'text-emerald-500' },
]

const patients = [
  { name:'Arjun Mehta', id:'P-00142', condition:'Hypertension', visit:'Today, 10:30', status:'Follow-up', badge:'bg-amber-100 text-amber-700' },
  { name:'Priya Nair', id:'P-00138', condition:'Diabetes T2', visit:'Yesterday', status:'Stable', badge:'bg-emerald-100 text-emerald-700' },
  { name:'Ramesh Patil', id:'P-00131', condition:'Post-surgery', visit:'22 Apr', status:'Critical', badge:'bg-red-100 text-red-700' },
  { name:'Sneha Iyer', id:'P-00129', condition:'Thyroid', visit:'20 Apr', status:'Review', badge:'bg-sky-100 text-sky-700' },
]

const schedule = [
  { name:'Arjun Mehta', sub:'Follow-up Consultation', time:'10:30', bg:'bg-sky-50', badge:'bg-sky-100 text-sky-700' },
  { name:'New Patient Intake', sub:'Cardiology OPD', time:'12:00', bg:'bg-slate-50', badge:'bg-amber-100 text-amber-700' },
  { name:'Report Review Session', sub:'Lab results — 8 pending', time:'14:30', bg:'bg-slate-50', badge:'bg-teal-100 text-teal-700' },
]

const getRealDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Dashboard() {
  const nav = useNavigate()
  return (
    <div className="p-7">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s,i)=>(
          <div key={i} className={`bg-white rounded-xl border border-slate-100 p-5 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all ${s.cls}`}>
            <div className="mb-2">{s.icon}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</div>
            <div className="font-heading text-3xl font-bold text-slate-800 my-1">{s.value}</div>
            <div className={`text-xs font-medium ${s.chgColor}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
              <div className="font-heading text-sm font-semibold text-slate-700">Recent Patients</div>
              <button onClick={()=>nav('/doctor/patients')} className="text-xs text-sky-500 hover:text-sky-700">View all →</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Patient</th>
                  <th className="text-left px-4 py-3 font-semibold">Condition</th>
                  <th className="text-left px-4 py-3 font-semibold">Last Visit</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p,i)=>(
                  <tr key={i} onClick={()=>nav('/doctor/profile')}
                    className="border-t border-slate-50 hover:bg-sky-50/60 cursor-pointer transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.id}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{p.condition}</td>
                    <td className="px-4 py-3.5 text-slate-500">{p.visit}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.badge}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={15} className="text-slate-600"/>
              <div className="font-heading text-sm font-semibold text-slate-700">AI Alerts</div>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white gradient-bg">Live</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0"/>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Drug interaction risk</div>
                  <div className="text-xs text-slate-500">Warfarin + Aspirin for Ramesh Patil (P-00131)</div>
                </div>
                <button className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white transition text-slate-600 whitespace-nowrap">Review</button>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0"/>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Abnormal glucose spike</div>
                  <div className="text-xs text-slate-500">Priya Nair — HbA1c above threshold</div>
                </div>
                <button className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white transition text-slate-600">View</button>
              </div>
              <div className="flex items-start gap-3 p-3 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0"/>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Risk model updated</div>
                  <div className="text-xs text-slate-500">5 patients re-assessed, no new risks detected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock size={15} className="text-sky-500"/> Today's Schedule
            </div>
            <div className="space-y-2.5">
              {schedule.map((s,i)=>(
                <div key={i} className={`flex justify-between items-center p-3 ${s.bg} rounded-lg`}>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.sub}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${s.badge}`}>{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Link size={15} className="text-teal-500"/> Blockchain Status
            </div>
            <div className="text-xs text-slate-400 mb-3">All records immutably stored and verified</div>
            <div className="space-y-2.5 text-sm">
              {[
                ['Block Height','#2,841,022','font-mono font-bold text-sky-600'],
                ['Records Stored','14,822','font-bold'],
                ['Network Status',<span key="status" className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>,''],
                ['Last Sync','2 min ago','text-slate-400'],
              ].map(([k,v,vc],i)=>(
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-500">{k}</span>
                  <span className={vc}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
