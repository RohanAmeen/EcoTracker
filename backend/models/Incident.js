const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    required: true,
    trim: true
  },
  locationDetails: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better query performance
incidentSchema.index({ createdAt: -1 });

const Incident = mongoose.model('Incident', incidentSchema);

// Log when the model is created
console.log('Incident model created');

module.exports = Incident; 