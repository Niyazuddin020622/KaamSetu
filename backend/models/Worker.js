const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  category: { 
    type: String, 
    required: true, 
    enum: [
      'Plumber', 
      'Welder', 
      'Electrician', 
      'Carpenter', 
      'Painter', 
      'Mason (Mistri)', 
      'AC & Appliance', 
      'Mechanic', 
      'Cleaner & Housekeeping', 
      'General Helper / Labour'
    ] 
  },
  subSkills: [{ type: String, trim: true }],
  experienceYears: { type: Number, required: true, default: 2 },
  hourlyRate: { type: Number, required: true },
  dailyRate: { type: Number },
  city: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  pincode: { type: String, default: '' },
  bio: { type: String, required: true },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  badge: { type: String, default: 'Verified Pro' },
  rating: { type: Number, default: 4.8, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 10 },
  languages: [{ type: String }],
  emergencyAvailable: { type: Boolean, default: false },
  toolsProvided: { type: Boolean, default: true },
  portfolio: [{
    title: String,
    imageUrl: String
  }],
  reviews: [reviewSchema]
}, { timestamps: true });

// Index for high performance search
workerSchema.index({ name: 'text', bio: 'text', subSkills: 'text', area: 'text', city: 'text' });

module.exports = mongoose.model('Worker', workerSchema);
