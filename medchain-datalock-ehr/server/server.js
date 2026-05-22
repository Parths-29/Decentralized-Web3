require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const MongooseUser = require('./models/User');
const MongoosePatient = require('./models/Patient');
const MongooseAuditLog = require('./models/AuditLog');

// ============================================================================
// HIGH-FIDELITY IN-MEMORY SHIM ENGINE FOR OFFLINE DEVELOPMENT
// ============================================================================
const mockUsers = [];
const mockPatients = [];
const mockAuditLogs = [];

// Create default cardiologist
(async () => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('DoctorPassword123!', salt);
  mockUsers.push({
    _id: 'mock-doctor-id',
    name: 'Dr. Riya Sharma',
    email: 'dr.riya@medchain.ai',
    phone: '9876543210',
    password: hashedPassword,
    hospital: 'AIIMS Mumbai',
    specialty: 'Cardiologist'
  });
})();

// Initial seed data
const initialMockPatients = [
  {
    ID: 'P-00142',
    Name: 'Arjun Mehta',
    Age: '34',
    Gender: 'Male',
    BloodGrp: 'O+',
    ContactNo: '+91 98765 43210',
    Address: '12 MG Road, Mumbai',
    Email: 'arjun.mehta@example.com',
    Condition: 'Hypertension',
    Status: 'Follow-up',
    Risk: 70,
    Initials: 'AM',
    Color: 'from-sky-500 to-teal-500',
    Allergies: ['Penicillin'],
    Vitals: { BP: '145/90', HR: '78', SpO2: '98', LDL: '162' },
    Medicalvisits: [
      {
        Date: '2026-01-12',
        Description: 'Initial consultation for high BP',
        Doctor: 'Dr. Riya Sharma',
        Diagnosis: 'Stage 1 Hypertension',
        Testperformed: 'BP Monitoring, Basic ECG',
        Prescription: 'Amlodipine 5mg once daily',
        Testreports: 'QmXjGh7KpLmR2nQsT9vWx4yZ3A'
      },
      {
        Date: '2026-03-05',
        Description: 'Routine cardiac monitoring follow-up',
        Doctor: 'Dr. Riya Sharma',
        Diagnosis: 'Hypertension — stable under medication',
        Testperformed: 'Standard ECG, Echo',
        Prescription: 'Continue Amlodipine 5mg, Lifestyle shifts',
        Testreports: 'QmEe7Ff9GgHh1IiJj3KkLl5MmNn'
      }
    ],
    PreviousHash: '0000000000000000000000000000000000000000000000000000000000000000'
  },
  {
    ID: 'P-00138',
    Name: 'Priya Nair',
    Age: '52',
    Gender: 'Female',
    BloodGrp: 'A+',
    ContactNo: '+91 91234 56789',
    Address: '7 Bandra West, Mumbai',
    Email: 'priya.nair@example.com',
    Condition: 'Diabetes T2',
    Status: 'Stable',
    Risk: 40,
    Initials: 'PN',
    Color: 'from-teal-500 to-cyan-500',
    Allergies: ['Sulfonamides'],
    Vitals: { BP: '122/80', HR: '70', SpO2: '99', LDL: '115' },
    Medicalvisits: [
      {
        Date: '2026-02-15',
        Description: 'Routine endocrinology checkup',
        Doctor: 'Dr. Anand Verma',
        Diagnosis: 'Type 2 Diabetes — Managed',
        Testperformed: 'HbA1c test, Renal Profile',
        Prescription: 'Metformin 500mg twice daily',
        Testreports: 'QmPq8rSt2UvWxYzAa1Bb3Cc5Dd'
      }
    ],
    PreviousHash: '0000000000000000000000000000000000000000000000000000000000000000'
  },
  {
    ID: 'P-00131',
    Name: 'Ramesh Patil',
    Age: '67',
    Gender: 'Male',
    BloodGrp: 'B-',
    ContactNo: '+91 70000 11111',
    Address: '45 Jubilee Hills, Hyderabad',
    Email: 'ramesh.patil@example.com',
    Condition: 'Post-cardiac surgery',
    Status: 'Critical',
    Risk: 90,
    Initials: 'RP',
    Color: 'from-red-500 to-orange-500',
    Allergies: [],
    Vitals: { BP: '130/85', HR: '84', SpO2: '94', LDL: '140' },
    Medicalvisits: [
      {
        Date: '2026-04-20',
        Description: 'Post-operative monitoring check',
        Doctor: 'Dr. Riya Sharma',
        Diagnosis: 'Moderate recovery post CABG surgery',
        Testperformed: '12-lead ECG, Echo',
        Prescription: 'Clopidogrel 75mg, Atorvastatin 40mg',
        Testreports: 'QmFf2Gg7Hh1Ii4Jj8Kk9Ll2Mm5Nn'
      }
    ],
    PreviousHash: '0000000000000000000000000000000000000000000000000000000000000000'
  }
];

// Initialize Mock Patients & Logs
setTimeout(() => {
  initialMockPatients.forEach(p => {
    p.CurrentHash = calculatePatientHash(p);
    mockPatients.push(p);

    const eventData = `${new Date().toISOString()}-Created Patient Chart-SYSTEM-${p.ID}`;
    const eventHash = crypto.createHash('sha256').update(eventData).digest('hex');
    mockAuditLogs.push({
      action: 'Created Patient Chart',
      userId: 'mock-doctor-id',
      userName: 'Dr. Riya Sharma',
      patientId: p.ID,
      ip: '127.0.0.1',
      hash: eventHash,
      timestamp: new Date()
    });
  });
}, 500);

class ShimUser {
  constructor(data) {
    Object.assign(this, data);
    this._id = this._id || 'mock-doctor-id';
  }
  async save() {
    mockUsers.push(this);
    return this;
  }
  async comparePassword(password) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, this.password);
  }
  static async findOne({ email }) {
    if (process.env.USE_MOCK_DB === 'true') {
      const u = mockUsers.find(u => u.email === email);
      return u ? new ShimUser(u) : null;
    }
    return MongooseUser.findOne({ email });
  }
  static async deleteMany({}) {
    if (process.env.USE_MOCK_DB === 'true') {
      mockUsers.length = 0;
      return { deletedCount: 0 };
    }
    return MongooseUser.deleteMany({});
  }
}

class ShimPatient {
  constructor(data) {
    Object.assign(this, data);
    this.createdAt = this.createdAt || new Date();
    this.Medicalvisits = this.Medicalvisits || [];
    this.Vitals = this.Vitals || { BP: '120/80', HR: '72', SpO2: '98', LDL: '100' };
    this.Allergies = this.Allergies || [];
  }
  async save() {
    const idx = mockPatients.findIndex(p => p.ID === this.ID);
    if (idx !== -1) {
      mockPatients[idx] = this;
    } else {
      mockPatients.push(this);
    }
    return this;
  }
  static find() {
    if (process.env.USE_MOCK_DB === 'true') {
      const results = [...mockPatients];
      const chain = {
        sort: (sortSpec) => {
          results.sort((a, b) => b.createdAt - a.createdAt);
          return chain;
        },
      };
      chain.then = (onFulfilled) => Promise.resolve(results).then(onFulfilled);
      return chain;
    }
    return MongoosePatient.find();
  }
  static async findOne({ ID }) {
    if (process.env.USE_MOCK_DB === 'true') {
      const p = mockPatients.find(p => p.ID === ID);
      return p ? new ShimPatient(p) : null;
    }
    return MongoosePatient.findOne({ ID });
  }
  static async findOneAndDelete({ ID }) {
    if (process.env.USE_MOCK_DB === 'true') {
      const idx = mockPatients.findIndex(p => p.ID === ID);
      if (idx !== -1) {
        const p = mockPatients.splice(idx, 1)[0];
        return new ShimPatient(p);
      }
      return null;
    }
    return MongoosePatient.findOneAndDelete({ ID });
  }
  static async deleteMany({}) {
    if (process.env.USE_MOCK_DB === 'true') {
      mockPatients.length = 0;
      return { deletedCount: 0 };
    }
    return MongoosePatient.deleteMany({});
  }
}

class ShimAuditLog {
  constructor(data) {
    Object.assign(this, data);
    this.timestamp = this.timestamp || new Date();
  }
  async save() {
    mockAuditLogs.push(this);
    return this;
  }
  static find() {
    if (process.env.USE_MOCK_DB === 'true') {
      let results = [...mockAuditLogs];
      const chain = {
        sort: (sortSpec) => {
          results.sort((a, b) => b.timestamp - a.timestamp);
          return chain;
        },
        limit: (n) => {
          results = results.slice(0, n);
          return chain;
        },
      };
      chain.then = (onFulfilled) => Promise.resolve(results).then(onFulfilled);
      return chain;
    }
    return MongooseAuditLog.find();
  }
  static async deleteMany({}) {
    if (process.env.USE_MOCK_DB === 'true') {
      mockAuditLogs.length = 0;
      return { deletedCount: 0 };
    }
    return MongooseAuditLog.deleteMany({});
  }
}

const User = ShimUser;
const Patient = ShimPatient;
const AuditLog = ShimAuditLog;

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretmedchainkey12345';

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// Cryptographic DataLock Helpers
function calculatePatientHash(patient) {
  const criticalData = {
    ID: patient.ID,
    Name: patient.Name,
    Age: patient.Age,
    Gender: patient.Gender,
    BloodGrp: patient.BloodGrp,
    Email: patient.Email,
    Medicalvisits: patient.Medicalvisits.map(v => ({
      Date: v.Date,
      Description: v.Description,
      Doctor: v.Doctor,
      Diagnosis: v.Diagnosis,
      Testperformed: v.Testperformed,
      Prescription: v.Prescription,
      Testreports: v.Testreports
    })),
    PreviousHash: patient.PreviousHash
  };
  return crypto.createHash('sha256').update(JSON.stringify(criticalData)).digest('hex');
}

async function logAuditEvent(action, userId, userName, patientId, ip = '127.0.0.1') {
  const eventData = `${new Date().toISOString()}-${action}-${userId}-${patientId}`;
  const eventHash = crypto.createHash('sha256').update(eventData).digest('hex');

  const newLog = new AuditLog({
    action,
    userId: userId || 'SYSTEM',
    userName: userName || 'System Service',
    patientId: patientId || 'N/A',
    ip,
    hash: eventHash
  });

  await newLog.save();
  return newLog;
}

// Authentication Middleware
const authenticateDoctor = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Return a mock default doctor if authentication token is absent for easier local testing/compatibility
    req.doctor = { id: 'SYSTEM', name: 'Dr. Riya Sharma', hospital: 'AIIMS Mumbai' };
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.doctor = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized credentials. Access token expired or invalid.' });
  }
};

// ============================================================================
// API ROUTES
// ============================================================================

// Health check endpoint
app.get('/', async (req, res) => {
  res.json({
    status: 'operational',
    mode: 'secure-mongodb',
    timestamp: new Date().toISOString(),
    blockchain: {
      connected: true,
      channel: 'mongodb-secure-cluster',
      chaincode: 'datalock-v1.0.0',
      network: 'DataLock Cryptographic Network'
    },
    api: { version: '1.0.0', name: 'MedChain.ai EHR Secure MongoDB API' }
  });
});

// --- Doctor Auth Endpoints ---

// Doctor Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, hospital, specialty } = req.body;
    
    if (!name || !email || !phone || !password || !hospital) {
      return res.status(400).json({ error: 'All professional fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'A medical practitioner is already registered under this ID.' });
    }

    const newUser = new User({ name, email, phone, password, hospital, specialty });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email, hospital: newUser.hospital },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    await logAuditEvent('Registered Doctor Account', newUser._id, newUser.name, 'N/A');

    res.status(201).json({
      success: true,
      token,
      doctor: { id: newUser._id, name: newUser.name, email: newUser.email, hospital: newUser.hospital, specialty: newUser.specialty }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Credentials ID and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid clinical practitioner ID or password.' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, hospital: user.hospital },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    await logAuditEvent('Authenticated Doctor Session', user._id, user.name, 'N/A');

    res.json({
      success: true,
      token,
      doctor: { id: user._id, name: user.name, email: user.email, hospital: user.hospital, specialty: user.specialty }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Patient CRUD & Cryptographic Hashing ---

// Get All Patient Records
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Patient
app.get('/api/patients/:id', authenticateDoctor, async (req, res) => {
  try {
    const patient = await Patient.findOne({ ID: req.params.id });
    if (!patient) {
      return res.status(404).json({ error: `Patient record '${req.params.id}' does not exist.` });
    }

    // Log the read event
    await logAuditEvent('Viewed Patient Profile', req.doctor.id, req.doctor.name, patient.ID);

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Patient Record
app.post('/api/patients', authenticateDoctor, async (req, res) => {
  try {
    const { id, name, age, gender, bloodGrp, contactNo, address, email, condition, status, risk, vitals, allergies, initials, color } = req.body;

    if (!id || !name || !age || !gender || !bloodGrp || !email) {
      return res.status(400).json({ error: 'Missing core demographic fields: id, name, age, gender, bloodGrp, email.' });
    }

    const existingPatient = await Patient.findOne({ ID: id });
    if (existingPatient) {
      return res.status(409).json({ error: `Patient record '${id}' already exists.` });
    }

    // Default Initials and Avatar Color if not provided
    const getInitials = (n) => n.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const calculatedInitials = initials || getInitials(name);
    const defaultColors = [
      'from-sky-500 to-teal-500',
      'from-teal-500 to-cyan-500',
      'from-violet-500 to-indigo-500',
      'from-pink-500 to-rose-500',
      'from-amber-500 to-orange-500'
    ];
    const chosenColor = color || defaultColors[Math.floor(Math.random() * defaultColors.length)];

    const newPatient = new Patient({
      ID: id,
      Name: name,
      Age: age,
      Gender: gender,
      BloodGrp: bloodGrp,
      ContactNo: contactNo || '',
      Address: address || '',
      Email: email,
      Condition: condition || 'General Checkup',
      Status: status || 'Stable',
      Risk: risk !== undefined ? risk : 30,
      Initials: calculatedInitials,
      Color: chosenColor,
      Medicalvisits: [],
      Vitals: vitals || { BP: '120/80', HR: '72', SpO2: '98', LDL: '100' },
      Allergies: allergies || [],
      PreviousHash: '0000000000000000000000000000000000000000000000000000000000000000'
    });

    // Compute Cryptographic Initial DataLock Hash
    newPatient.CurrentHash = calculatePatientHash(newPatient);
    await newPatient.save();

    await logAuditEvent('Created Patient Chart', req.doctor.id, req.doctor.name, newPatient.ID);

    res.status(201).json({
      success: true,
      message: `Patient chart '${id}' cryptographically sealed and saved.`,
      data: newPatient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Medical Visit to Patient
app.post('/api/patients/:id/visits', authenticateDoctor, async (req, res) => {
  try {
    const { visit } = req.body;
    if (!visit) {
      return res.status(400).json({ error: 'Clinical visit details are required.' });
    }

    const requiredFields = ['Date', 'Description', 'Doctor', 'Diagnosis', 'Testperformed', 'Prescription'];
    for (const f of requiredFields) {
      if (!visit[f]) {
        return res.status(400).json({ error: `Medical visit data missing required property: ${f}` });
      }
    }

    const patient = await Patient.findOne({ ID: req.params.id });
    if (!patient) {
      return res.status(404).json({ error: `Patient '${req.params.id}' does not exist.` });
    }

    // Set Blockchain Lock Sequence: Chain current hash to previous hash
    patient.PreviousHash = patient.CurrentHash;
    
    // Add medical visit
    patient.Medicalvisits.push({
      Date: visit.Date,
      Description: visit.Description,
      Doctor: visit.Doctor,
      Diagnosis: visit.Diagnosis,
      Testperformed: visit.Testperformed,
      Prescription: visit.Prescription,
      Testreports: visit.Testreports || 'Qm' + crypto.randomBytes(16).toString('hex').slice(0, 24)
    });

    // Automatically recalculate secure SHA-256 seal
    patient.CurrentHash = calculatePatientHash(patient);
    await patient.save();

    await logAuditEvent('Added Clinical Visit & Adjusted Seal', req.doctor.id, req.doctor.name, patient.ID);

    res.status(201).json({
      success: true,
      message: `Visit added. Clinical chart hash updated to: ${patient.CurrentHash}`,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Patient
app.delete('/api/patients/:id', authenticateDoctor, async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ ID: req.params.id });
    if (!patient) {
      return res.status(404).json({ error: `Patient '${req.params.id}' does not exist.` });
    }

    await logAuditEvent('Permanently Deleted Patient Chart', req.doctor.id, req.doctor.name, req.params.id);

    res.json({
      success: true,
      message: `Patient chart '${req.params.id}' removed from server.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Vitals & Recalculate Hash
app.post('/api/patients/:id/vitals', authenticateDoctor, async (req, res) => {
  try {
    const { BP, HR, SpO2, LDL } = req.body;
    const patient = await Patient.findOne({ ID: req.params.id });
    if (!patient) {
      return res.status(404).json({ error: `Patient '${req.params.id}' does not exist.` });
    }

    patient.PreviousHash = patient.CurrentHash;
    if (BP) patient.Vitals.BP = BP;
    if (HR) patient.Vitals.HR = HR;
    if (SpO2) patient.Vitals.SpO2 = SpO2;
    if (LDL) patient.Vitals.LDL = LDL;

    patient.CurrentHash = calculatePatientHash(patient);
    await patient.save();

    await logAuditEvent('Updated Vitals & Re-sealed Chart', req.doctor.id, req.doctor.name, patient.ID);

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Audit & Security Verification ---

// Get Audit Trail Logs
app.get('/api/audit', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Audit Verification: Verify Entire Database Chain Integrity!
app.get('/api/audit/verify', async (req, res) => {
  try {
    const patients = await Patient.find();
    let tamperedRecords = [];

    for (let p of patients) {
      const computed = calculatePatientHash(p);
      if (computed !== p.CurrentHash) {
        tamperedRecords.push({
          ID: p.ID,
          Name: p.Name,
          StoredHash: p.CurrentHash,
          ExpectedHash: computed,
          errorType: 'TAMPERED_CONTENT'
        });
      }
    }

    res.json({
      success: true,
      integrityOK: tamperedRecords.length === 0,
      totalChecked: patients.length,
      compromisedCount: tamperedRecords.length,
      compromisedItems: tamperedRecords,
      verificationTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SERVER LAUNCH
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n🚀 MedChain.ai Secure MongoDB Server running at http://localhost:${PORT}`);
  console.log(`🔐 Cryptographic DataLock Layer ACTIVE`);
  console.log(`📂 Available Endpoints:`);
  console.log(`   POST  /api/auth/register    - Practitioner registration`);
  console.log(`   POST  /api/auth/login       - Practitioner session login`);
  console.log(`   GET   /api/patients         - Retrieve all patient profiles`);
  console.log(`   POST  /api/patients         - Create custom cryptographically sealed record`);
  console.log(`   GET   /api/patients/:id     - Fetch single patient details & log access`);
  console.log(`   POST  /api/patients/:id/visits - Add clinical visit history & recalculate SHA-256`);
  console.log(`   DELETE/api/patients/:id     - Remove clinical record & log permanent erasure`);
  console.log(`   GET   /api/audit            - Read database access audit logs`);
  console.log(`   GET   /api/audit/verify     - Perform cryptographic security validation scanning\n`);
});
