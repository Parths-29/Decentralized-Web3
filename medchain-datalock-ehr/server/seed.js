require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const User = require('./models/User');
const Patient = require('./models/Patient');
const AuditLog = require('./models/AuditLog');

// Helper to compute patient hash
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

const seedDatabase = async () => {
  await connectDB();

  try {
    // 1. Clear Collections
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('✓ Database cleared.');

    // 2. Create Default Doctors
    console.log('\n👨‍⚕️ Seeding Doctor accounts...');
    
    // We create a pre-hashed Doctor so we can verify logins instantly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('DoctorPassword123!', salt);

    const defaultDoctor = new User({
      name: 'Dr. Riya Sharma',
      email: 'dr.riya@medchain.ai',
      phone: '9876543210',
      password: hashedPassword,
      hospital: 'AIIMS Mumbai',
      specialty: 'Cardiologist'
    });

    await defaultDoctor.save();
    console.log(`✓ Doctor created: ${defaultDoctor.name} (${defaultDoctor.email})`);
    console.log('💡 Demo Login Password: "DoctorPassword123!"');

    // 3. Create Sample Patients & calculate initial cryptolock hashes
    console.log('\n👥 Seeding Patient records with DataLock cryptolink hashes...');

    const samplePatients = [
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
        ]
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
        ]
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
        ]
      }
    ];

    for (const pData of samplePatients) {
      const patient = new Patient(pData);
      
      // Calculate cryptographic DataLock hashes
      patient.PreviousHash = '0000000000000000000000000000000000000000000000000000000000000000';
      patient.CurrentHash = calculatePatientHash(patient);
      
      await patient.save();
      console.log(`✓ Patient added: ${patient.Name} (ID: ${patient.ID}, Hash: ${patient.CurrentHash.slice(0, 16)}...)`);
      
      // Seed audit entries for initial creations
      const eventData = `${new Date().toISOString()}-Created Patient Chart-SYSTEM-${patient.ID}`;
      const eventHash = crypto.createHash('sha256').update(eventData).digest('hex');
      const audit = new AuditLog({
        action: 'Created Patient Chart',
        userId: defaultDoctor._id.toString(),
        userName: defaultDoctor.name,
        patientId: patient.ID,
        ip: '127.0.0.1',
        hash: eventHash
      });
      await audit.save();
    }

    console.log('\n🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
