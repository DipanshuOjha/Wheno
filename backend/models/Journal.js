const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateKey: { type: String, required: true }, // e.g., '20260319'
  title: { type: String },
  body: { type: String },
  mood: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);