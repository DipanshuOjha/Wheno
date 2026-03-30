const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  location: {
    name: { type: String, default: 'Guwahati, India' },
    lat: { type: Number, default: 26.1445 },
    lon: { type: Number, default: 91.7362 }
  },
  subscription: {
    active: { type: Boolean, default: false },
    type: String,
    expiry: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
