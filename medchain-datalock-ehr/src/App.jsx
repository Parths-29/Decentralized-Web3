import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorApp from './pages/doctor/DoctorApp'
import PatientLogin from './pages/patient/PatientLogin'
import PatientApp from './pages/patient/PatientApp'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/*" element={<DoctorApp />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/*" element={<PatientApp />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}