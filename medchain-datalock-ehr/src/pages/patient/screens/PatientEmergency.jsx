import { AlertTriangle, User, Phone, Stethoscope, Download } from 'lucide-react'

export default function PatientEmergency() {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <div className="font-heading text-xl font-bold text-red-500 flex items-center gap-2">
          🆘 Emergency Profile
        </div>
        <div className="text-sm text-slate-400 mt-1">Share this QR in emergencies — visible without login</div>
      </div>

      {/* QR Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center mb-4">
        <div className="w-44 h-44 mx-auto mb-5 rounded-2xl border-4 border-slate-800 bg-white relative overflow-hidden"
          style={{
            backgroundImage:`repeating-linear-gradient(0deg,#0f172a 0 3px,transparent 3px 9px),repeating-linear-gradient(90deg,#0f172a 0 3px,transparent 3px 9px)`,
            backgroundSize:'9px 9px'
          }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white px-3 py-1.5 rounded-lg font-heading text-sm font-bold text-slate-900 shadow">MC</div>
          </div>
        </div>
        <div className="font-heading text-lg font-bold text-slate-800">Arjun Mehta · P-00142</div>
        <div className="text-sm text-slate-400 mt-1 mb-5">Scan QR for instant health access</div>
        <button className="px-8 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-md inline-flex items-center gap-2"
          style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
          <Download size={14}/> Download QR
        </button>
      </div>

      {/* Critical Info */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6">
        <div className="text-sm font-bold text-red-500 mb-5 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500"/> Critical Health Information
        </div>

        {/* Blood Group + Age */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Blood Group</div>
            <div className="font-heading text-3xl font-bold text-red-500">O+</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Age</div>
            <div className="font-heading text-3xl font-bold text-slate-800">34</div>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-3">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0"/>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Allergies</div>
              <div className="text-sm font-bold text-red-600">Penicillin — DO NOT ADMINISTER</div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
            <Stethoscope size={16} className="text-amber-500 mt-0.5 flex-shrink-0"/>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Conditions</div>
              <div className="text-sm text-slate-700">Stage 1 Hypertension · Hyperlipidemia</div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
            <Phone size={16} className="text-slate-400 mt-0.5 flex-shrink-0"/>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Emergency Contact</div>
              <div className="text-sm font-medium text-slate-700">Sunita Mehta (Wife) · +91-98765-43210</div>
            </div>
          </div>
          <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-start gap-3">
            <User size={16} className="text-sky-500 mt-0.5 flex-shrink-0"/>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Primary Doctor</div>
              <div className="text-sm font-medium text-slate-700">Dr. Riya Sharma · AIIMS Mumbai · +91-11-2659-XXXX</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}