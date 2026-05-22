import { useState, useEffect } from 'react'
import { Shield, ShieldCheck, ShieldAlert, RefreshCw, Database, Activity } from 'lucide-react'
import { apiFetch } from '../../../utils/api'

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [scanResult, setScanResult] = useState(null)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/audit')
      if (res && res.data) {
        setLogs(res.data)
      }
    } catch (err) {
      console.warn('API error, utilizing offline fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  const runIntegrityScan = async () => {
    setVerifying(true)
    try {
      const res = await apiFetch('/audit/verify')
      if (res) {
        setScanResult(res)
      }
    } catch (err) {
      console.error('DataLock verification failed:', err)
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    runIntegrityScan()
  }, [])

  // Dynamic calculations based on logs
  const stats = {
    views: logs.filter(l => l.action.toLowerCase().includes('view') || l.action.toLowerCase().includes('read')).length,
    edits: logs.filter(l => l.action.toLowerCase().includes('visit') || l.action.toLowerCase().includes('seal') || l.action.toLowerCase().includes('vital')).length,
    adds: logs.filter(l => l.action.toLowerCase().includes('create') || l.action.toLowerCase().includes('register')).length,
  }

  const getLogDotColor = (action) => {
    const act = action.toLowerCase()
    if (act.includes('delete') || act.includes('erase') || act.includes('tamper')) return 'bg-red-500'
    if (act.includes('create') || act.includes('add') || act.includes('register')) return 'bg-emerald-500'
    if (act.includes('auth') || act.includes('login') || act.includes('session')) return 'bg-amber-500'
    return 'bg-sky-500'
  }

  const formatTimestamp = (ts) => {
    try {
      const d = new Date(ts)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } catch {
      return ts
    }
  }

  return (
    <div className="p-7">
      <div className="grid grid-cols-3 gap-5">
        {/* Left Side: Audit Trail */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
            <div className="font-heading text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Database size={16} className="text-slate-500"/>
              Clinical Access Audit Trail
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchLogs} 
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-500 flex items-center gap-1"
                title="Refresh Log list"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''}/>
              </button>
              <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 bg-white outline-none">
                <option>All Security Events</option>
                <option>Access Checks</option>
                <option>EHR Modification</option>
                <option>Auth Events</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
            {loading && logs.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">Loading audit events from MongoDB...</div>
            ) : logs.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                No logs recorded yet. Demographics reads, logins, and additions will generate immutable records here.
              </div>
            ) : (
              logs.map((l, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full ${getLogDotColor(l.action)} mt-1.5 flex-shrink-0`}/>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800 font-medium truncate">{l.action}</div>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono truncate">
                      User: {l.userName} · IP: {l.ip} · Hash: {l.hash?.slice(0, 16)}...
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap">{formatTimestamp(l.timestamp || l.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Integrity and Security Checks */}
        <div className="space-y-5">
          {/* Cryptographic Scanner */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-heading text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Shield size={16} className="text-sky-600"/>
                DataLock Integrity Scan
              </div>
              <button 
                onClick={runIntegrityScan}
                disabled={verifying}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition disabled:opacity-50"
              >
                <RefreshCw size={11} className={verifying ? 'animate-spin' : ''}/>
                {verifying ? 'Scanning...' : 'Scan Now'}
              </button>
            </div>

            {scanResult ? (
              scanResult.integrityOK ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <ShieldCheck className="text-emerald-600" size={20}/>
                  </div>
                  <div className="font-bold text-xs text-emerald-800 uppercase tracking-wide">Mongoose DataLock Secured</div>
                  <p className="text-xs text-emerald-600">
                    All {scanResult.totalChecked} records cryptographically validated. SHA-256 blocks perfectly intact.
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">Verified: {new Date(scanResult.verificationTime).toLocaleTimeString()}</div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
                    <ShieldAlert className="text-rose-600" size={20}/>
                  </div>
                  <div className="font-bold text-xs text-rose-800 text-center uppercase tracking-wide">Compromised Blocks Detected!</div>
                  <p className="text-xs text-rose-600 text-center">
                    DataLock found {scanResult.compromisedCount} modified chart entries outside the API pipeline!
                  </p>
                  <div className="divide-y divide-rose-100 mt-2 max-h-[120px] overflow-y-auto">
                    {scanResult.compromisedItems.map((item, idx) => (
                      <div key={idx} className="py-1.5 text-[10px] text-rose-700">
                        <strong>ID:</strong> {item.ID} · <strong>Name:</strong> {item.Name}
                        <div className="font-mono text-slate-400 truncate">Exp: {item.ExpectedHash.slice(0, 12)}...</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                Start integrity validation scan to verify database SHA-256 block structures.
              </div>
            )}
          </div>

          {/* Activity Statistics */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4 flex items-center gap-1.5">
              <Activity size={15} className="text-slate-500"/>
              Dynamic Audit Metrics
            </div>
            <div className="space-y-3">
              {[
                { dot: 'bg-sky-500', label: 'EHR Profile Accesses', val: stats.views || 0 },
                { dot: 'bg-emerald-500', label: 'Cryptographic Seals Formed', val: stats.edits + stats.adds || 0 },
                { dot: 'bg-amber-500', label: 'Doctor Registrations / Sessions', val: logs.filter(l => l.action.includes('Doctor') || l.action.includes('Session')).length || 0 },
                { dot: 'bg-indigo-500', label: 'Total Audited Transactions', val: logs.length || 0 },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className={`w-2 h-2 rounded-full ${s.dot}`}/>
                    {s.label}
                  </div>
                  <span className="font-heading font-bold text-xs text-slate-800">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}