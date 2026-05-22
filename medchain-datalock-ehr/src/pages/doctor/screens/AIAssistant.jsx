import { useState } from 'react'
import { Send } from 'lucide-react'

const initMsgs = [
  { role:'ai', text:"Hello Dr. Sharma! I'm your AI clinical assistant. I can help with diagnosis support, drug interactions, risk prediction, and clinical guidelines. How can I assist you today?" },
  { role:'user', text:"What's the first-line treatment for Stage 1 hypertension in a 34-year-old male?" },
  { role:'ai', text:"For Stage 1 HTN in a young adult:\n\n**First-line:** Lifestyle modification for 3-6 months (DASH diet, sodium restriction, weight loss, exercise).\n\n**If CVD risk >10%:** Add pharmacotherapy — ACE inhibitor, ARB, thiazide, or CCB (Amlodipine).\n\n*Patient Arjun Mehta's LDL is elevated — consider concurrent statin therapy.* " },
]

const chips = ['Check drug interactions','Predict 10-year CVD risk','Latest clinical guidelines','Differential diagnosis','Lab interpretation']

const insights = [
  { bg:'bg-amber-50 border-amber-300', dot:'bg-amber-400', label:'Risk Alert', body:"Ramesh Patil's post-op risk score is 85/100. Schedule ICU review." },
  { bg:'bg-emerald-50 border-emerald-300', dot:'bg-emerald-400', label:'Good Progress', body:"Vikram Rao's asthma symptoms reduced 60% over past month." },
  { bg:'bg-violet-50 border-violet-300', dot:'bg-violet-400', label:'Prediction', body:"Priya Nair has 34% risk of diabetic retinopathy in 2 years." },
]

export default function AIAssistant() {
  const [msgs, setMsgs] = useState(initMsgs)
  const [input, setInput] = useState('')

  const send = (text) => {
    if (!text.trim()) return
    setMsgs(m=>[...m,{role:'user',text},{role:'ai',text:'Analyzing your clinical query with AI-assisted reasoning. Checking patient records, drug databases, and clinical guidelines... '}])
    setInput('')
  }

  return (
    <div className="p-7">
      <div className="grid grid-cols-3 gap-5">
        {/* Chat */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col" style={{height:'calc(100vh - 160px)'}}>
          <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
            <div className="font-heading text-sm font-semibold text-slate-700"> AI Clinical Assistant</div>
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white gradient-bg">GPT-Med v4</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgs.map((m,i)=>(
              <div key={i} className={`flex gap-3 ${m.role==='user'?'flex-row-reverse':''} max-w-[85%] ${m.role==='user'?'ml-auto':''} animate-fade`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${m.role==='ai'?'gradient-bg text-white':'bg-sky-100 text-sky-600'}`}>
                  {m.role==='ai'?'':'RS'}
                </div>
                <div className={m.role==='ai'?'chat-bubble-ai':'chat-bubble-user'}
                  style={{whiteSpace:'pre-line'}} dangerouslySetInnerHTML={{__html:m.text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>')}}/>
              </div>
            ))}
          </div>

          {/* Chips */}
          <div className="px-5 py-3 border-t border-slate-50 flex flex-wrap gap-2">
            {chips.map((c,i)=>(
              <button key={i} onClick={()=>send(c)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-full text-slate-500 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition">{c}</button>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)}
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-400 outline-none focus:ring-2 focus:ring-sky-100 transition"
              placeholder="Ask clinical questions, check interactions..."/>
            <button onClick={()=>send(input)}
              className="px-5 py-2.5 gradient-bg text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition">
              <Send size={14}/> Send
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4"> AI Insights</div>
            <div className="space-y-3">
              {insights.map((ins,i)=>(
                <div key={i} className={`p-3 ${ins.bg} border rounded-lg border-l-4`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${ins.dot}`}/>
                    <div className="text-xs font-bold text-slate-700">{ins.label}</div>
                  </div>
                  <div className="text-xs text-slate-600">{ins.body}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="font-heading text-sm font-semibold text-slate-700 mb-4"> Quick References</div>
            <div className="space-y-2">
              {['JNC 8 Hypertension Guidelines','ADA Standards of Diabetes Care 2026','WHO Essential Medicines List','Drug Interaction Database'].map((r,i)=>(
                <div key={i} className="px-3 py-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 cursor-pointer hover:bg-sky-50 hover:text-sky-600 transition flex justify-between items-center">
                  {r} <span>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}