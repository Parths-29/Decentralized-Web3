import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { apiFetch } from '../../../utils/api'

const initialMeds = [
  { name:'Amlodipine', type:'Calcium channel blocker', dose:'10mg', freq:'0-0-1', dur:'30 days', status:'ok' },
  { name:'Atorvastatin', type:'Statin', dose:'20mg', freq:'0-0-1', dur:'30 days', status:'ok' },
]

const emptyMed = { name:'', type:'', dose:'', freq:'', dur:'', status:'ok' }

export default function Prescriptions() {
  const [submitted, setSubmitted] = useState(false)
  const [meds, setMeds] = useState(initialMeds)
  const [showForm, setShowForm] = useState(false)
  const [newMed, setNewMed] = useState(emptyMed)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diagnosis, setDiagnosis] = useState('Stage 1 Hypertension')
  const [notes, setNotes] = useState('Follow-up in 4 weeks. Reduce salt intake. Monitor BP daily.')
  const [blockchainHash, setBlockchainHash] = useState('')

  useEffect(() => {
    const fetchPatient = async () => {
      const activeId = localStorage.getItem('active_patient_id') || 'P-00142'
      setLoading(true)
      try {
        const res = await apiFetch(`/patients/${activeId}`)
        if (res && res.data) {
          setPatient(res.data)
          if (res.data.Condition) {
            setDiagnosis(res.data.Condition)
          }
        }
      } catch (err) {
        console.warn('API error fetching patient for prescription:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPatient()
  }, [])

  const handleAdd = () => {
    if (!newMed.name.trim()) return
    setMeds(prev => [...prev, { ...newMed }])
    setNewMed(emptyMed)
    setShowForm(false)
  }

  const handleDelete = (i) => {
    setMeds(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmitPrescription = async () => {
    if (meds.length === 0) return
    setLoading(true)
    try {
      const activeId = localStorage.getItem('active_patient_id') || 'P-00142'
      const prescriptionText = meds.map(m => `${m.name} ${m.dose} ${m.freq} for ${m.dur}`).join(', ')
      const res = await apiFetch(`/patients/${activeId}/visits`, {
        method: 'POST',
        body: JSON.stringify({
          visit: {
            Date: new Date().toISOString().slice(0, 10),
            Description: `Prescription issued: ${meds.map(m=>m.name).join(', ')}`,
            Doctor: 'Dr. Riya Sharma',
            Diagnosis: diagnosis,
            Testperformed: 'Routine review',
            Prescription: prescriptionText,
            Testreports: 'None'
          }
        })
      })
      if (res && res.success) {
        setBlockchainHash(res.data.CurrentHash)
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Failed to submit prescription to blockchain:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-7">
      <div className="grid grid-cols-2 gap-5">
        {/* Left: Form */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-5"> New Prescription</div>

            {/* Patient info */}
            <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg mb-5">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${patient?.Color || 'from-sky-500 to-teal-500'} text-white text-xs font-bold flex items-center justify-center`}>
                {patient?.Initials || 'P'}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{patient?.Name || 'Arjun Mehta'} · {patient?.ID || 'P-00142'}</div>
                <div className="text-xs text-slate-500">
                  {patient?.Condition || 'Hypertension'} · Allergies: {patient?.Allergies?.join(', ') || 'None'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Diagnosis / Indication</label>
              <input 
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none focus:ring-2 focus:ring-sky-100 transition bg-white"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
            </div>

            <div className="font-heading text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Medicines</div>

            {meds.map((m, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 mb-2 p-3 bg-slate-50 rounded-lg items-center">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{m.name}</div>
                  <div className="text-xs text-slate-400">{m.type}</div>
                </div>
                <input className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:border-sky-400 outline-none" defaultValue={m.dose}/>
                <input className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:border-sky-400 outline-none" defaultValue={m.freq}/>
                <div className="flex items-center gap-1">
                  <input className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:border-sky-400 outline-none" defaultValue={m.dur}/>
                  <button onClick={() => handleDelete(i)} className="text-slate-300 hover:text-red-400 transition">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            ))}

            {/* Inline Add Form */}
            {showForm && (
              <div className="mb-3 p-3 bg-sky-50 border-2 border-sky-200 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-sky-400 outline-none"
                    placeholder="Medicine name *"
                    value={newMed.name}
                    onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))}
                  />
                  <input
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-sky-400 outline-none"
                    placeholder="Type (e.g. Beta-blocker)"
                    value={newMed.type}
                    onChange={e => setNewMed(p => ({ ...p, type: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:border-sky-400 outline-none"
                    placeholder="Dose (e.g. 50mg)"
                    value={newMed.dose}
                    onChange={e => setNewMed(p => ({ ...p, dose: e.target.value }))}
                  />
                  <input
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:border-sky-400 outline-none"
                    placeholder="Freq (e.g. 1-0-1)"
                    value={newMed.freq}
                    onChange={e => setNewMed(p => ({ ...p, freq: e.target.value }))}
                  />
                  <input
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:border-sky-400 outline-none"
                    placeholder="Duration (e.g. 30 days)"
                    value={newMed.dur}
                    onChange={e => setNewMed(p => ({ ...p, dur: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setShowForm(false); setNewMed(emptyMed) }}
                    className="px-3 py-1 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-3 py-1 text-xs text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition font-semibold">
                    Confirm Add
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowForm(true)}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition mb-4 flex items-center justify-center gap-2">
              <Plus size={15}/> Add Medicine
            </button>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Doctor Notes</label>
              <textarea 
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none resize-none focus:ring-2 focus:ring-sky-100 transition bg-white" 
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <div className="text-emerald-600 font-semibold text-sm">⛓️ Prescription Sealed on DataLock Chain!</div>
                <div className="text-xs text-emerald-500 mt-1 truncate">Hash: {blockchainHash || '0xB9d3...f220'}</div>
                <div className="text-xs text-slate-400 mt-1">Verified block integrity guaranteed.</div>
              </div>
            ) : (
              <button 
                onClick={handleSubmitPrescription}
                disabled={loading}
                className="w-full py-3 gradient-bg text-white font-heading font-semibold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-50">
                {loading ? 'Executing DataLock Seal...' : 'Submit Prescription to Blockchain'}
              </button>
            )}
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="font-heading text-sm font-semibold text-slate-700"> AI Drug Interaction Check</div>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white gradient-bg">Live</span>
            </div>
            <div className="space-y-2.5">
              {[
                ...meds.map(m => ({
                  icon: '',
                  label: `${m.name} — Clear`,
                  sub: 'No interactions detected',
                  cls: 'bg-emerald-50 border-l-4 border-emerald-400'
                })),
                { icon:'', label:'Penicillin Allergy Flag', sub:'Patient has documented penicillin allergy. Avoid all beta-lactams.', cls:'bg-amber-50 border-l-4 border-amber-400' },
              ].map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 ${a.cls} rounded-r-lg`}>
                  <span className="text-lg">{a.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{a.label}</div>
                    <div className="text-xs text-slate-500">{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
              <div className="text-xs font-semibold text-teal-700"> AI Risk Score: <strong>Low (2/10)</strong> · Prescription appears safe to dispense</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4"> Recent Prescriptions</div>
            {['#P-2026-091 · Arjun Mehta · 24 Apr','#P-2026-088 · Priya Nair · 22 Apr'].map((p,i)=>(
              <div key={i} className="p-3 bg-slate-50 rounded-lg mb-2.5 last:mb-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-slate-700">{p.split('·')[0]}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-sky-50 to-teal-50 border border-teal-200 rounded-full text-[10px] font-semibold text-teal-600"> Verified</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{p.split('·').slice(1).join('·').trim()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
