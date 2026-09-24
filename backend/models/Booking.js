const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  worker: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Worker', 
    required: true 
  },
  workerName: { type: String, required: true },
  workerCategory: { type: String, required: true },
  workerPhone: { type: String, required: true },
  
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerAddress: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, default: '' },
  
  serviceRequired: { type: String, required: true },
  jobDescription: { type: String, default: '' },
  preferredDate: { type: String, required: true },
  preferredTimeSlot: { type: String, default: 'Morning (9 AM - 12 PM)' },
  urgency: { 
    type: String, 
    enum: ['Emergency (Within 2 Hours)', 'Today', 'Tomorrow / Scheduled'], 
    default: 'Today' 
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  estimatedCost: { type: Number },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
