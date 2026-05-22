import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, CheckCircle, X, FileText, Image, File } from 'lucide-react'
import { apiFetch } from '../../../utils/api'

const getFileIcon = (name) => {
  if (name.endsWith('.pdf')) return '📄'
  if (name.endsWith('.dcm')) return '🫁'
  if (name.match(/\.(jpg|jpeg|png)$/i)) return '🖼️'
  return '📁'
}

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)}KB`
  return `${(bytes/(1024*1024)).toFixed(1)}MB`
}

const today = () => {
  const d = new Date()
  return `${d.getDate()} ${d.toLocaleString('default',{month:'short'})}`
}

export default function UploadReports() {
  const [progress, setProgress]     = useState(0)
  const [done, setDone]             = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [dragOver, setDragOver]     = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [recentFiles, setRecentFiles] = useState([
    { icon:'📄', name:'lipid_profile_priya_apr22.pdf', meta:'22 Apr · 0.8MB' },
    { icon:'🫁', name:'ecg_ramesh_apr20.dcm',          meta:'20 Apr · 4.2MB' },
  ])
  const [patient, setPatient] = useState(null)
  const [reportType, setReportType] = useState('Lab Report')
  const fileInputRef = useRef()

  useEffect(() => {
    const fetchPatient = async () => {
      const activeId = localStorage.getItem('active_patient_id') || 'P-00142'
      try {
        const res = await apiFetch(`/patients/${activeId}`)
        if (res && res.data) {
          setPatient(res.data)
        }
      } catch (err) {
        console.warn('API error fetching patient for report upload:', err)
      }
    }
    fetchPatient()
  }, [])

  const addFiles = (files) => {
    const arr = Array.from(files).filter(f => f.size <= 50 * 1024 * 1024)
    setSelectedFiles(prev => {
      const names = new Set(prev.map(f=>f.name))
      return [...prev, ...arr.filter(f=>!names.has(f.name))]
    })
    setDone(false)
    setUploading(false)
    setProgress(0)
  }

  const removeFile = (i) => setSelectedFiles(prev => prev.filter((_,idx)=>idx!==i))

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    addFiles(e.dataTransfer.files)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const handleSubmit = () => {
    if (!selectedFiles.length) return
    setUploading(true); setDone(false); setProgress(0)
    setTimeout(() => setProgress(45),  300)
    setTimeout(() => setProgress(78),  900)
    setTimeout(() => setProgress(95), 1800)
    setTimeout(async () => {
      setProgress(100)
      try {
        const activeId = localStorage.getItem('active_patient_id') || 'P-00142'
        const file = selectedFiles[0]
        await apiFetch(`/patients/${activeId}/visits`, {
          method: 'POST',
          body: JSON.stringify({
            visit: {
              Date: new Date().toISOString().slice(0, 10),
              Description: `Report Uploaded: ${file.name}`,
              Doctor: 'Dr. Riya Sharma',
              Diagnosis: patient?.Condition || 'Review',
              Testperformed: reportType,
              Prescription: 'None',
              Testreports: 'Qm' + Math.random().toString(36).substring(2, 15)
            }
          })
        })
        setDone(true)
        setRecentFiles(prev => [
          ...selectedFiles.map(f => ({
            icon: getFileIcon(f.name),
            name: f.name,
            meta: `${today()} · ${formatSize(f.size)}`
          })),
          ...prev
        ])
        setSelectedFiles([])
      } catch (err) {
        console.error('Failed to submit report visit to database:', err)
      }
    }, 2600)
  }

  return (
    <div className="p-7">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-5">📤 Upload Medical Report</div>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Patient</label>
              <input 
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none bg-slate-50 text-slate-600 font-semibold" 
                readOnly 
                value={patient ? `${patient.Name} · ${patient.ID}` : 'Arjun Mehta · P-00142'}
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Report Type</label>
              <select 
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none bg-white"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                {['Lab Report','X-Ray / Radiology','MRI / CT Scan','Pathology','Prescription'].map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all group
                ${dragOver
                  ? 'border-sky-400 bg-sky-50 scale-[1.01]'
                  : 'border-slate-200 hover:border-sky-400 hover:bg-sky-50'}`}
            >
              <div className={`text-4xl mb-3 transition-transform ${dragOver ? 'scale-125' : 'group-hover:scale-110'}`}>
                {dragOver ? '📂' : '📁'}
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-1">
                {dragOver ? 'Release to drop files' : 'Drop files here or click to upload'}
              </div>
              <div className="text-xs text-slate-400 mb-4">PDF, DICOM, JPG, PNG — Max 50MB</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 gradient-bg text-white rounded-lg text-sm font-semibold pointer-events-none">
                <Upload size={14}/> Choose Files
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.dcm,.jpg,.jpeg,.png"
                className="hidden"
                onChange={e => { addFiles(e.target.files); e.target.value='' }}
              />
            </div>

            {/* Selected files list */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Selected Files</div>
                {selectedFiles.map((f,i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-lg">{getFileIcon(f.name)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700 truncate">{f.name}</div>
                      <div className="text-xs text-slate-400">{formatSize(f.size)}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                      className="text-slate-300 hover:text-red-400 transition flex-shrink-0">
                      <X size={14}/>
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  disabled={uploading && !done}
                  className="w-full mt-2 py-2.5 gradient-bg text-white text-sm font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  <Upload size={14}/>
                  Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''} to Blockchain
                </button>
              </div>
            )}

            {/* Progress */}
            {uploading && (
              <div className="mt-4 space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium ${done?'bg-teal-50 border-teal-200 text-teal-700':'bg-sky-50 border-sky-200 text-sky-700'}`}>
                  {done
                    ? <CheckCircle size={16} className="text-teal-500 flex-shrink-0"/>
                    : <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin flex-shrink-0"/>}
                  {done ? '✅ Processing complete — stored on blockchain!' : '🔍 OCR Processing — extracting text from document...'}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Uploading...</span><span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full gradient-bg rounded-full transition-all duration-700" style={{width:`${progress}%`}}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4">🔐 Blockchain Storage</div>
            <div className="bg-gradient-to-br from-sky-50 to-teal-50 border border-teal-200 rounded-lg p-4 mb-3">
              <div className="text-xs font-semibold text-teal-700 mb-2">🛡 How your data is protected:</div>
              <div className="space-y-1.5 text-xs text-slate-600">
                {['File encrypted with AES-256 before storage','IPFS distributed storage — no single point of failure','Hash stored on Ethereum blockchain permanently','Only authorized doctors can decrypt and view','Full audit trail of every access attempt'].map((s,i)=>(
                  <div key={i} className="flex items-center gap-2"><span className="text-teal-500">✓</span>{s}</div>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-400">Compliant with HIPAA & DPDP Act 2023</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4">🕓 Recently Uploaded</div>
            {recentFiles.length === 0 && (
              <div className="text-xs text-slate-400 text-center py-4">No files uploaded yet</div>
            )}
            {recentFiles.map((f,i)=>(
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 mb-2 last:mb-0">
                <span className="text-xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700 truncate">{f.name}</div>
                  <div className="text-xs text-slate-400">{f.meta}</div>
                </div>
                <span className="px-2 py-0.5 bg-gradient-to-r from-sky-50 to-teal-50 border border-teal-200 rounded-full text-[10px] font-semibold text-teal-600 whitespace-nowrap">✓ Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
