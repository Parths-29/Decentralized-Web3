const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: 'SYSTEM'
  },
  userName: {
    type: String,
    default: 'System Administrator'
  },
  patientId: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    default: '127.0.0.1'
  },
  hash: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
