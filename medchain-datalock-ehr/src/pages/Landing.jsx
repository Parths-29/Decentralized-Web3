import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, UserRound, Lock, Link as LinkIcon, Bot, Hospital } from 'lucide-react';

export default function Landing() {
  const nav = useNavigate();

  // IntersectionObserver for scroll reveals if the page gets longer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: <Stethoscope size={28} strokeWidth={2} />,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
      title: 'Doctor Portal',
      desc: 'Access patient records, prescribe medications, view AI alerts',
      route: '/doctor/login'
    },
    {
      icon: <UserRound size={28} strokeWidth={2} />,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      title: 'Patient Portal',
      desc: 'View records, track medicines, manage consent & emergency info',
      route: '/patient/login'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Subtle Noise / Radial Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(13, 148, 136, 0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 60%)
          `
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl w-full stagger">
        
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-teal-600 shadow-premium-sm border border-slate-100 bg-white text-xl">
            ⛓️
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Med<span className="text-teal-600">Chain</span>.ai
          </h1>
        </div>

        {/* Hero Typography */}
        <div className="mb-16">
          <h2 className="text-hero text-slate-900 mb-4 max-w-3xl mx-auto">
            Verifiable healthcare <br />
            <span className="text-slate-400">on the blockchain.</span>
          </h2>
          <p className="text-body-lg text-slate-500 mx-auto">
            Secure, AI-driven medical records designed for speed and reliability. Choose your portal to continue.
          </p>
        </div>

        {/* Cards Layout - Asymmetric/Elevated */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-16 px-4">
          {cards.map((card, idx) => (
            <div 
              key={card.title}
              onClick={() => nav(card.route)}
              className="card-lift flex-1 max-w-md bg-white border border-slate-200/60 rounded-2xl p-8 text-left cursor-pointer group"
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)'
              }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>

              <h3 className="text-h3 text-slate-900 mb-3">{card.title}</h3>
              <p className="text-body text-slate-500 mb-8">{card.desc}</p>

              <div className="inline-flex items-center font-medium text-sm text-slate-900 group-hover:text-teal-600 transition-colors">
                Enter Portal 
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex gap-6 justify-center flex-wrap pt-8 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-label text-slate-400">
            <Lock size={14} className="text-teal-500" /> End-to-end encrypted
          </span>
          <span className="flex items-center gap-1.5 text-label text-slate-400">
            <LinkIcon size={14} className="text-teal-500" /> Blockchain verified
          </span>
          <span className="flex items-center gap-1.5 text-label text-slate-400">
            <Bot size={14} className="text-teal-500" /> AI powered
          </span>
          <span className="flex items-center gap-1.5 text-label text-slate-400">
            <Hospital size={14} className="text-teal-500" /> Hospital grade
          </span>
        </div>

      </div>
    </div>
  );
}
