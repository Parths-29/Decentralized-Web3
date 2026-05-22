import { useState } from 'react'
import { Send, Bot } from 'lucide-react'

const initMsgs = [{ role:'ai', text:"Hi Arjun! I'm your personal health assistant. I can explain your reports, remind you about medicines, answer health questions, and help you understand your condition. What would you like to know?" }]
const chips = ["What does my BP mean?","Explain my Lipid Profile","Side effects of Amlodipine","Tips to lower BP naturally"]
const replies = {
  "What does my BP mean?":"Your blood pressure of 145/90 mmHg is Stage 1 Hypertension. The top number (systolic) is when your heart beats, bottom (diastolic) is when it rests. Dr. Sharma has prescribed Amlodipine to help bring this down. 💙",
  "Explain my Lipid Profile":"Your LDL (bad cholesterol) is 162 mg/dL — slightly high. Ideal is below 100 mg/dL. Your doctor prescribed Atorvastatin to lower this. Eating less fried food and exercising helps too! 🥗",
  "Side effects of Amlodipine":"Common side effects: swollen ankles, flushing (feeling warm), headache, and dizziness when standing up quickly. These usually go away in a week. Contact Dr. Sharma if they persist. 💊",
  "Tips to lower BP naturally":"1) Reduce salt intake 2) Exercise 30 min/day 3) DASH diet (fruits, veggies) 4) Limit alcohol 5) Manage stress. Combined with your medication, this works best! 🌿",
}

export default function PatientAI() {
  const [msgs, setMsgs] = useState(initMsgs)
  const [input, setInput] = useState('')

  const send = (text) => {
    if (!text.trim()) return
    setMsgs(m => [...m, { role:'user', text }])
    setTimeout(() => {
      const rep = replies[text] || "That's a great health question! Based on your current records, let me provide a personalized response. Always consult Dr. Sharma for medical decisions. 😊"
      setMsgs(m => [...m, { role:'ai', text: rep }])
    }, 600)
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-6">

      <div className="font-heading text-xl font-bold text-slate-800 mb-5">AI Health Assistant</div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>

              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm
                ${m.role === 'ai' ? 'text-white' : 'bg-teal-100 text-teal-700'}`}
                style={m.role === 'ai' ? {background:'linear-gradient(135deg,#0d9488,#06b6d4)'} : {}}>
                {m.role === 'ai' ? <Bot size={16} color="white"/> : 'AM'}
              </div>

              {/* Bubble */}
              <div className={`max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${m.role === 'ai'
                  ? 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'
                  : 'text-white rounded-tr-sm'}`}
                style={m.role === 'user' ? {background:'linear-gradient(135deg,#0d9488,#06b6d4)'} : {}}>
                {m.text}
              </div>

            </div>
          ))}
        </div>

        {/* Chips */}
        <div className="px-6 py-3 border-t border-slate-50 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <button key={i} onClick={() => send(c)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-full text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
              {c}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:border-teal-400 outline-none focus:ring-2 focus:ring-teal-100 transition"
            placeholder="Ask me about your health..."
          />
          <button onClick={() => send(input)}
            className="px-5 py-2.5 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition shadow-sm"
            style={{background:'linear-gradient(135deg,#0d9488,#06b6d4)'}}>
            <Send size={14}/> Send
          </button>
        </div>

      </div>
    </div>
  )
}