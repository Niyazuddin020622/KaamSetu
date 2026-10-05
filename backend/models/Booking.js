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
  workerAvatar: { type: String, default: '' },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerAddress: { type: String, required: true },
  addressDetails: {
    building: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' },
    country: { type: String, default: 'India' }
  },
  pincode: { type: String, default: '' },
  city: { type: String, required: true },
  area: { type: String, default: '' },
  
  serviceRequired: { type: String, required: true },
  jobDescription: { type: String, default: '' },
  preferredDate: { type: String, required: true },
  preferredDay: { type: String, default: '' },
  preferredTimeSlot: { type: String, default: 'Morning (9 AM - 12 PM)' },
  urgency: { 
    type: String, 
    enum: ['Emergency', 'Emergency (Within 2 Hours)', 'Today', 'Tomorrow', 'Tomorrow / Scheduled', 'Scheduled'], 
    default: 'Today' 
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  estimatedCost: { type: Number },
  completedDate: { type: String, default: '' },
  notes: { type: String, default: '' },
  workerCity: { type: String, default: '' },
  isCrossCity: { type: Boolean, default: false },
  distanceKm: { type: Number, default: 0 },

  // Lifecycle Timestamps & Audit Trail
  acceptedAt: { type: Date, default: null },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  cancelledBy: { type: String, enum: ['customer', 'worker', 'admin', 'system', ''], default: '' }
}, { timestamps: true });

// High-performance compound indexes for sub-millisecond query speed
bookingSchema.index({ worker: 1, preferredDate: 1, status: 1 });
bookingSchema.index({ customerPhone: 1, createdAt: -1 });
bookingSchema.index({ workerPhone: 1, createdAt: -1 });
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ city: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
