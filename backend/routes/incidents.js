const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// Create incident
router.post('/', async (req, res) => {
  try {
    console.log('Received incident data:', JSON.stringify(req.body, null, 2));
    
    const incident = new Incident(req.body);
    console.log('Created incident object:', JSON.stringify(incident, null, 2));
    
    const savedIncident = await incident.save();
    console.log('Saved incident:', JSON.stringify(savedIncident, null, 2));
    
    res.status(201).json(savedIncident);
  } catch (error) {
    console.error('Error creating incident:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to create incident', details: error.message });
  }
});

module.exports = router; 