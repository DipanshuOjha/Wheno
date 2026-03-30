const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateKey: { type: String, required: true },
  activityId: { type: String, required: true }, 
  activityLabel: String,
  activityIcon: String,
  startTime: String,
  endTime: String,
  grahaHora: String, 
  notes: String,
  guestsEmails: String,
  guestsWhatsapp: String
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);