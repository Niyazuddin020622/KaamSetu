const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'कृपया अपना नाम दर्ज करें'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'कृपया अपना मोबाइल नंबर दर्ज करें'],
    unique: true,
    trim: true
  },
  pin: {
    type: String,
    required: [true, 'कृपया 4-अंकों का गुप्त PIN बनाएं']
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  addressDetails: {
    building: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },
  pincode: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: 'Ahmedabad',
    trim: true
  },
  area: {
    type: String,
    default: '',
    trim: true
  },
  role: {
    type: String,
    default: 'customer',
    enum: ['customer']
  }
}, { timestamps: true });

// Hash PIN before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('pin')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare PIN helper method
userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('User', userSchema);
