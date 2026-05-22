import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, X } from 'lucide-react'
import { apiFetch } from '../../../utils/api'

const initialPatients = [
  { initials:'AM', color:'from-sky-500 to-teal-500', name:'Arjun Mehta', id:'P-00142', age:'34', blood:'O+', condition:'Hypertension', visit:'Today', risk:70, status:'Follow-up', badge:'bg-amber-100 text-amber-700' },
  { initials:'PN', color:'from-teal-500 to-cyan-500', name:'Priya Nair', id:'P-00138', age:'52', blood:'A+', condition:'Diabetes T2', visit:'Yesterday', risk:40, status:'Stable', badge:'bg-emerald-100 text-emerald-700' },
  { initials:'RP', color:'from-red-500 to-orange-500', name:'Ramesh Patil', id:'P-00131', age:'67', blood:'B-', condition:'Post-cardiac surgery', visit:'22 Apr', risk:90, status:'Critical', badge:'bg-red-100 text-red-700' },
  { initials:'SI', color:'from-violet-500 to-indigo-500', name:'Sneha Iyer', id:'P-00129', age:'29', blood:'AB+', condition:'Thyroid disorder', visit:'20 Apr', risk:30, status:'Review', badge:'bg-sky-100 text-sky-700' },
  { initials:'VR', color:'from-amber-500 to-red-500', name:'Vikram Rao', id:'P-00127', age:'45', blood:'O-', condition:'Asthma', visit:'19 Apr', risk:25, status:'Stable', badge:'bg-emerald-100 text-emerald-700' },
]

const colorOptions = [
  'from-sky-500 to-teal-500',
  'from-teal-500 to-cyan-500',
  'from-violet-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-green-500 to-emerald-500',
]

const statusConfig = {
  'Follow-up': { badge: 'bg-amber-100 text-amber-700', risk: 60 },
  'Stable':    { badge: 'bg-emerald-100 text-emerald-700', risk: 30 },
  'Critical':  { badge: 'bg-red-100 text-red-700', risk: 90 },
  'Review':    { badge: 'bg-sky-100 text-sky-700', risk: 45 },
}

const emptyForm = { name:'', age:'', blood:'', condition:'', status:'Stable' }

function RiskBar({ val }) {
  const col = val>70?'from-red-500 to-red-700':val>40?'from-amber-400 to-orange-500':'from-emerald-400 to-teal-500'
  return (
    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${col}`} style={{width:`${val}%`}}/>
    </div>
  )
}

export default function Patients() {
  const nav = useNavigate()
  const [patients, setPatients] = useState(initialPatients)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const getInitials = (name) => name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/patients')
      if (res && res.data) {
        setPatients(res.data)
      }
    } catch (err) {
      console.warn('API error, utilizing seeded mock patient data:', err)
      // Keep static initialPatients as dynamic fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())      e.name = 'Required'
    if (!form.age.trim())       e.age = 'Required'
    if (!form.blood.trim())     e.blood = 'Required'
    if (!form.condition.trim()) e.condition = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async () => {
    if (!validate()) return
    const cfg = statusConfig[form.status] || statusConfig['Stable']
    const newId = `P-${String(Math.floor(10000 + Math.random() * 90000)).slice(0,5)}`
    
    const newPatientData = {
      id: newId,
      name: form.name.trim(),
      age: form.age.trim(),
      gender: 'Male', // default clinical fallback
      bloodGrp: form.blood.trim(),
      email: `${form.name.toLowerCase().replace(/\s+/g, '')}@medchain-patient.com`,
      condition: form.condition.trim(),
      status: form.status,
      risk: cfg.risk,
      initials: getInitials(form.name),
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
    }

    try {
      const res = await apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify(newPatientData)
      })
      setPatients(prev => [res.data, ...prev])
    } catch (err) {
      console.warn('Failed to commit patient to server, saving locally:', err)
      const fallbackPatient = {
        ...newPatientData,
        visit: 'Today',
        badge: cfg.badge
      }
      setPatients(prev => [fallbackPatient, ...prev])
    }

    setForm(emptyForm)
    setErrors({})
    setShowModal(false)
  }

  const inputCls = (field) =>
    `w-full px-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
      errors[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
    }`

  return (
    <div className="p-7">
      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="font-semibold text-slate-800 text-sm">➕ Add New Patient</div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm); setErrors({}) }}
                className="text-slate-400 hover:text-slate-600 transition">
                <X size={18}/>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Full Name *</label>
                <input className={inputCls('name')} placeholder="e.g. Rohit Sharma"
                  value={form.name} onChange={e => setForm(p=>({...p, name: e.target.value}))}/>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Age *</label>
                  <input className={inputCls('age')} placeholder="e.g. 42"
                    value={form.age} onChange={e => setForm(p=>({...p, age: e.target.value}))}/>
                  {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Blood Group *</label>
                  <select className={inputCls('blood')}
                    value={form.blood} onChange={e => setForm(p=>({...p, blood: e.target.value}))}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=>(
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {errors.blood && <p className="text-xs text-red-500 mt-1">{errors.blood}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Condition / Diagnosis *</label>
                <input className={inputCls('condition')} placeholder="e.g. Type 2 Diabetes"
                  value={form.condition} onChange={e => setForm(p=>({...p, condition: e.target.value}))}/>
                {errors.condition && <p className="text-xs text-red-500 mt-1">{errors.condition}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Status</label>
                <select className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none focus:ring-2 focus:ring-sky-100 transition bg-white"
                  value={form.status} onChange={e => setForm(p=>({...p, status: e.target.value}))}>
                  {Object.keys(statusConfig).map(s=>(
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => { setShowModal(false); setForm(emptyForm); setErrors({}) }}
                className="px-4 py-2 text-sm text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition font-medium">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="px-5 py-2 text-sm text-white gradient-bg rounded-lg hover:opacity-90 transition font-semibold shadow-sm">
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-3 text-slate-400"/>
          <input className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none focus:ring-2 focus:ring-sky-100 transition"
            placeholder="Search by name, ID, condition..."/>
        </div>
        {['All Departments','All Status','Sort: Recent'].map((s,i)=>(
          <select key={i} className="px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm text-slate-500 focus:border-sky-400 outline-none bg-white">
            <option>{s}</option>
          </select>
        ))}
        <button onClick={() => setShowModal(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 border-2 border-sky-400 text-sky-600 rounded-lg text-sm font-semibold hover:bg-sky-50 transition">
          <Plus size={15}/> Add Patient
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
          <div className="font-heading text-sm font-semibold text-slate-700">{patients.length} Patients</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:border-sky-400 hover:text-sky-600 transition"> List</button>
            <button className="px-3 py-1.5 text-xs border border-sky-400 rounded-lg text-sky-600 bg-sky-50">⊞ Grid</button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wide">
            {['Patient','Age / Blood','Condition','Last Visit','Risk','Status','Actions'].map(h=>(
              <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {patients.map((p,i)=>{
              const pName = p.Name || p.name;
              const pId = p.ID || p.id;
              const pAge = p.Age || p.age;
              const pBlood = p.BloodGrp || p.blood;
              const pCondition = p.Condition || p.condition;
              const pVisit = p.visit || (p.Medicalvisits && p.Medicalvisits.length > 0 ? p.Medicalvisits[p.Medicalvisits.length - 1].Date : 'N/A');
              const pRisk = p.Risk !== undefined ? p.Risk : p.risk;
              const pStatus = p.Status || p.status;
              const pInitials = p.Initials || p.initials;
              const pColor = p.Color || p.color;
              const pBadge = statusConfig[pStatus]?.badge || 'bg-slate-100 text-slate-700';

              const handleRowClick = () => {
                localStorage.setItem('active_patient_id', pId);
                nav('/doctor/profile');
              };

              return (
                <tr key={i} onClick={handleRowClick}
                  className="border-t border-slate-50 hover:bg-sky-50/60 cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${pColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{pInitials}</div>
                      <div>
                        <div className="font-semibold text-slate-800">{pName}</div>
                        <div className="text-xs text-slate-400">{pId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{pAge} / {pBlood}</td>
                  <td className="px-5 py-4 text-slate-600">{pCondition}</td>
                  <td className="px-5 py-4 text-slate-500">{pVisit}</td>
                  <td className="px-5 py-4"><RiskBar val={pRisk}/></td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pBadge}`}>{pStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={e=>{e.stopPropagation(); handleRowClick();}}
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:border-sky-400 hover:text-sky-600 transition text-slate-600">View</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400">
          <span>Showing {patients.length} of {patients.length}</span>
          <div className="flex gap-1.5">
            {['← Prev','1','2','3','Next →'].map((p,i)=>(
              <button key={i} className={`px-3 py-1.5 rounded-lg text-xs transition border ${i===1?'gradient-bg text-white border-transparent':'border-slate-200 hover:border-sky-400 hover:text-sky-600 text-slate-500'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
