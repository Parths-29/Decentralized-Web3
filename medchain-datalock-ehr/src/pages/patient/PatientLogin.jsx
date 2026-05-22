import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react'

export default function PatientLogin() {
  const nav = useNavigate()
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  const [form, setForm] = useState({
    name: '', patientId: '', dob: '', phone: '', password: '', confirmPassword: '', bloodGroup: ''
  })

  const [loginForm, setLoginForm] = useState({ patientId: '', password: '' })
  const [loginErrors, setLoginErrors] = useState({})
  const [signupErrors, setSignupErrors] = useState({})

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleLogin = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })

  // Password rules
  const rules = {
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number:    /[0-9]/.test(form.password),
    symbol:    /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    length:    form.password.length >= 8,
  }
  const allRulesPassed = Object.values(rules).every(Boolean)
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== ''

  const RuleItem = ({ passed, label }) => (
    <div className="flex items-center gap-1.5">
      {passed
        ? <Check size={11} className="text-teal-400 shrink-0"/>
        : <X size={11} className="text-red-400 shrink-0"/>}
      <span className={`text-[11px] ${passed ? 'text-teal-400' : 'text-slate-400'}`}>{label}</span>
    </div>
  )

  const ErrorMsg = ({ msg }) => msg
    ? <p className="text-[11px] text-red-400 ml-1 mt-0.5">{msg}</p>
    : null

  const inputCls = (hasError) =>
    `w-full bg-white/50 border-2 rounded-2xl px-5 py-3.5 text-slate-800 text-sm outline-none focus:ring-4 transition-all placeholder:text-slate-300 ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-500/5'
        : 'border-slate-200 focus:border-teal-400 focus:ring-teal-500/5'
    }`

  const handleSubmit = () => {
    if (isSignup) {
      const e = {}
      if (!form.name.trim())           e.name = 'Full name is required'
      if (!form.patientId.trim())      e.patientId = 'Patient ID is required'
      if (!form.dob.trim())            e.dob = 'Date of birth is required'
      if (!form.phone.trim())          e.phone = 'Contact number is required'
      if (!form.bloodGroup.trim())     e.bloodGroup = 'Blood group is required'
      if (!form.password)              e.password = 'Password is required'
      else if (!allRulesPassed)        e.password = 'Password does not meet all requirements'
      if (!form.confirmPassword)       e.confirmPassword = 'Please confirm your password'
      else if (!passwordsMatch)        e.confirmPassword = 'Passwords do not match'

      setSignupErrors(e)
      if (Object.keys(e).length === 0) nav('/patient/dashboard')
    } else {
      const e = {}
      if (!loginForm.patientId.trim())  e.patientId = 'Patient ID is required'
      if (!loginForm.password.trim()) {
        e.password = 'Password is required'
      } else {
        const validPsw =
          /[A-Z]/.test(loginForm.password) &&
          /[a-z]/.test(loginForm.password) &&
          /[0-9]/.test(loginForm.password) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(loginForm.password) &&
          loginForm.password.length >= 8
        if (!validPsw) e.password = 'Incorrect password'
      }

      setLoginErrors(e)
      if (Object.keys(e).length === 0) nav('/patient/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{background:'linear-gradient(145deg, #ccfbf1 0%, #e0f2fe 50%, #f0f9ff 100%)'}}>

      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-[80px]"
        style={{background:'radial-gradient(circle, #0d9488, transparent)'}}/>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-10 blur-[60px]"
        style={{background:'radial-gradient(circle, #06b6d4, transparent)'}}/>

      {/* Back to Home */}
      <div className="relative z-10 w-full max-w-[420px] mb-4 px-2">
        <button onClick={() => nav('/')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 text-sm font-medium transition-all">
          <ArrowLeft size={15}/> Back to home
        </button>
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 w-full max-w-[420px] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)]">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{background:'linear-gradient(135deg, #0d9488, #06b6d4)'}}>⛓️</div>
            <h1 className="text-slate-900 font-bold text-2xl tracking-tight">
              Med<span className="text-teal-600">Chain</span>.ai
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-3">YOUR HEALTH DATA, YOUR CONTROL</p>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-slate-800 text-xl font-bold mb-2">
            {isSignup ? 'Patient Registration' : 'Patient Sign In'}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed px-2">
            {isSignup
              ? 'Create your account to access blockchain-secured health records.'
              : 'Enter your credentials to access your blockchain-secured records.'}
          </p>
        </div>

        <div className="space-y-4">

          {/* ── SIGN UP FIELDS ── */}
          {isSignup && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="name" value={form.name} onChange={handle}
                  className={inputCls(signupErrors.name)}
                  placeholder="Ananya Verma"/>
                <ErrorMsg msg={signupErrors.name}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient ID</label>
                <input name="patientId" value={form.patientId} onChange={handle}
                  className={inputCls(signupErrors.patientId)}
                  placeholder="P-00142"/>
                <ErrorMsg msg={signupErrors.patientId}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                <input name="dob" value={form.dob} onChange={handle}
                  type="date"
                  className={inputCls(signupErrors.dob)}/>
                <ErrorMsg msg={signupErrors.dob}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                <input name="phone" value={form.phone} onChange={handle}
                  type="tel" maxLength={10}
                  className={inputCls(signupErrors.phone)}
                  placeholder="+91 98765 43210"/>
                <ErrorMsg msg={signupErrors.phone}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handle}
                  className={inputCls(signupErrors.bloodGroup) + ' cursor-pointer'}>
                  <option value="">Select blood group</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <ErrorMsg msg={signupErrors.bloodGroup}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
                <div className="relative">
                  <input name="password" value={form.password} onChange={handle}
                    type={show ? 'text' : 'password'}
                    className={inputCls(signupErrors.password) + ' pr-10'}
                    placeholder="••••••••••••"/>
                  <button onClick={() => setShow(!show)}
                    className="absolute right-4 top-3.5 text-slate-300 hover:text-teal-500 transition-colors">
                    {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 grid grid-cols-2 gap-1.5 mt-1">
                    <RuleItem passed={rules.uppercase} label="Uppercase letter"/>
                    <RuleItem passed={rules.lowercase} label="Lowercase letter"/>
                    <RuleItem passed={rules.number}    label="Number (0–9)"/>
                    <RuleItem passed={rules.symbol}    label="Symbol (!@#...)"/>
                    <RuleItem passed={rules.length}    label="Min 8 characters"/>
                  </div>
                )}
                <ErrorMsg msg={signupErrors.password}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <input name="confirmPassword" value={form.confirmPassword} onChange={handle}
                    type={showConfirm ? 'text' : 'password'}
                    className={`w-full bg-white/50 border-2 rounded-2xl px-5 py-3.5 text-slate-800 text-sm outline-none transition-all placeholder:text-slate-300 pr-10
                      ${signupErrors.confirmPassword
                        ? 'border-red-300 focus:ring-4 focus:ring-red-500/5'
                        : form.confirmPassword === ''
                          ? 'border-slate-200'
                          : passwordsMatch
                            ? 'border-teal-400/60 focus:ring-4 focus:ring-teal-500/5'
                            : 'border-red-400/60 focus:ring-4 focus:ring-red-500/5'}`}
                    placeholder="••••••••••••"/>
                  <button onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-3.5 text-slate-300 hover:text-teal-500 transition-colors">
                    {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                {form.confirmPassword !== '' && (
                  <div className={`flex items-center gap-1.5 ml-1 ${passwordsMatch ? 'text-teal-500' : 'text-red-400'}`}>
                    {passwordsMatch
                      ? <><Check size={12}/><span className="text-[11px]">Passwords match</span></>
                      : <><X size={12}/><span className="text-[11px]">Passwords do not match</span></>}
                  </div>
                )}
                <ErrorMsg msg={signupErrors.confirmPassword}/>
              </div>
            </>
          )}

          {/* ── SIGN IN FIELDS ── */}
          {!isSignup && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient ID</label>
                <input name="patientId" value={loginForm.patientId} onChange={handleLogin}
                  className={inputCls(loginErrors.patientId)}
                  placeholder="P-00142"/>
                <ErrorMsg msg={loginErrors.patientId}/>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input name="password" value={loginForm.password} onChange={handleLogin}
                    type={show ? 'text' : 'password'}
                    className={inputCls(loginErrors.password) + ' pr-10'}
                    placeholder="••••••••••••"/>
                  <button onClick={() => setShow(!show)}
                    className="absolute right-4 top-3.5 text-slate-300 hover:text-teal-500 transition-colors">
                    {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                <ErrorMsg msg={loginErrors.password}/>
              </div>

              <div className="flex justify-between items-center px-1 text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-teal-500 focus:ring-0 shadow-sm"/>
                  Keep me signed in
                </label>
                <button className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button onClick={handleSubmit}
            className="w-full text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-teal-900/10 hover:shadow-teal-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all mt-4"
            style={{background:'linear-gradient(135deg, #0d9488, #06b6d4)'}}>
            {isSignup ? 'Create Patient Account' : 'Sign In Securely'}
          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-5">
            <Shield size={12} className="text-teal-400"/> PRIVACY-FIRST BLOCKCHAIN SESSION
          </div>
          <p className="text-sm text-slate-500">
            {isSignup ? 'Already have an account?' : 'New to the platform?'}
            <button onClick={() => {
              setIsSignup(!isSignup)
              setForm({ name:'', patientId:'', dob:'', phone:'', password:'', confirmPassword:'', bloodGroup:'' })
              setLoginForm({ patientId:'', password:'' })
              setLoginErrors({})
              setSignupErrors({})
            }}
              className="ml-2 text-teal-600 font-bold hover:underline decoration-2 underline-offset-4">
              {isSignup ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}
