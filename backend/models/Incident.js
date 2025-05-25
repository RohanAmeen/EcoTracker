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
  status: {
    type: String,
    required: true,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Coordinates must be [longitude, latitude]'
      }
    }
  },
  images: [{
    type: String,
    trim: true
  }],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ reportedBy: 1 });
incidentSchema.index({ location: '2dsphere' });

const Incident = mongoose.model('Incident', incidentSchema);

// Log when the model is created
console.log('Incident model created');

module.exports = Incident; 