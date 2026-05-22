import { useNavigate } from 'react-router-dom'
import { Stethoscope, UserRound, Lock, Link, Bot, Hospital } from 'lucide-react'

export default function Landing() {
  const nav = useNavigate()

  const cards = [
    {
      icon: <Stethoscope size={32} strokeWidth={1.5} />,
      iconBg: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
      title: 'Doctor Portal',
      desc: 'Access patient records, prescribe medications, view AI alerts',
      btnBg: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
      route: '/doctor/login'
    },
    {
      icon: <UserRound size={32} strokeWidth={1.5} />,
      iconBg: 'linear-gradient(135deg,#0d9488,#06b6d4)',
      title: 'Patient Portal',
      desc: 'View records, track medicines, manage consent & emergency info',
      btnBg: 'linear-gradient(135deg,#0d9488,#06b6d4)',
      route: '/patient/login'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{background:'linear-gradient(145deg,#0f2027,#1a3a3a,#0d2b2b)'}}>

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{background:'radial-gradient(circle,#0ea5e9,transparent 70%)',transform:'translate(30%,-30%)'}}/>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{background:'radial-gradient(circle,#0d9488,transparent 70%)',transform:'translate(-30%,30%)'}}/>

      <div className="relative z-10 text-center px-4 max-w-2xl w-full">

        {/* Brand — same as PatientLogin */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg text-xl"
            style={{background:'linear-gradient(135deg, #0d9488, #06b6d4)'}}>
            ⛓️
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Med<span className="text-teal-400">Chain</span>.ai
          </h1>
        </div>

        <h2 className="text-3xl font-bold mb-3 text-white">
          Blockchain-Powered Medical Records
        </h2>
        <p className="text-slate-400 text-base mb-14">
          Secure, AI-driven healthcare for the future. Choose your portal to continue.
        </p>

        {/* Cards */}
        <div className="flex gap-6 justify-center flex-wrap mb-14">
          {cards.map((card) => (
            <div key={card.title}
              onClick={() => nav(card.route)}
              className="cursor-pointer w-64 rounded-2xl p-8 flex flex-col items-center hover:-translate-y-2 transition-all duration-300 group"
              style={{
                background: '#162a2a',
                border: '1px solid #1e3a3a',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>

              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                style={{background: card.iconBg}}>
                <div className="text-white">{card.icon}</div>
              </div>

              <div className="text-lg font-bold text-white mb-2">{card.title}</div>
              <div className="text-sm text-slate-400 mb-6 leading-relaxed">{card.desc}</div>

              <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center group-hover:opacity-90 transition-opacity"
                style={{background: card.btnBg}}>
                Enter Portal →
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex gap-6 justify-center text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5"><Lock size={12}/> End-to-end encrypted</span>
          <span className="flex items-center gap-1.5"><Link size={12}/> Blockchain verified</span>
          <span className="flex items-center gap-1.5"><Bot size={12}/> AI powered</span>
          <span className="flex items-center gap-1.5"><Hospital size={12}/> Hospital grade</span>
        </div>

      </div>
    </div>
  )
}
