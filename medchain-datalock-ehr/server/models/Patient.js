const mongoose = require('mongoose');

const MedicalVisitSchema = new mongoose.Schema({
  Date: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Doctor: {
    type: String,
    required: true
  },
  Diagnosis: {
    type: String,
    required: true
  },
  Testperformed: {
    type: String,
    required: true
  },
  Prescription: {
    type: String,
    required: true
  },
  Testreports: {
    type: String,
    default: ''
  }
}, { _id: false });

const PatientSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  Name: {
    type: String,
    required: true,
    trim: true
  },
  Age: {
    type: String,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  BloodGrp: {
    type: String,
    required: true
  },
  ContactNo: {
    type: String,
    default: ''
  },
  Address: {
    type: String,
    default: ''
  },
  Email: {
    type: String,
    required: true,
    trim: true
  },
  Condition: {
    type: String,
    default: 'General Checkup'
  },
  Status: {
    type: String,
    enum: ['Stable', 'Follow-up', 'Critical', 'Review'],
    default: 'Stable'
  },
  Risk: {
    type: Number,
    default: 30
  },
  Initials: {
    type: String,
    default: 'PT'
  },
  Color: {
    type: String,
    default: 'from-sky-500 to-teal-500'
  },
  Medicalvisits: [MedicalVisitSchema],
  Vitals: {
    BP: { type: String, default: '120/80' },
    HR: { type: String, default: '72' },
    SpO2: { type: String, default: '98' },
    LDL: { type: String, default: '100' }
  },
  Allergies: {
    type: [String],
    default: []
  },
  PreviousHash: {
    type: String,
    default: '0000000000000000000000000000000000000000000000000000000000000000'
  },
  CurrentHash: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
