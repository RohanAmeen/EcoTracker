const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Incidents Route:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    user: req.user
  });
  next();
});

// Get recent incidents from all users (public endpoint)
router.get('/recent', async (req, res) => {
  try {
    console.log('GET /incidents/recent');
    
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type createdAt')
      .lean();
    
    console.log(`Found ${incidents.length} recent incidents`);
    
    // Format the response
    const formattedIncidents = incidents.map(incident => ({
      _id: incident._id,
      type: incident.type,
      createdAt: incident.createdAt
    }));
    
    res.json(formattedIncidents);
  } catch (error) {
    console.error('Error in GET /incidents/recent:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent incidents',
      details: error.message 
    });
  }
});

// Get all incidents for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /incidents - User:', req.user._id);
    
    const incidents = await Incident.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${incidents.length} incidents`);
    
    // Format the response
    const formattedIncidents = incidents.map(incident => ({
      _id: incident._id,
      description: incident.description,
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      location: incident.location,
      images: incident.images,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt
    }));
    
    res.json(formattedIncidents);
  } catch (error) {
    console.error('Error in GET /incidents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch incidents',
      details: error.message 
    });
  }
});

// Create incident
router.post('/', auth, async (req, res) => {
  try {
    console.log('POST /incidents - User:', req.user._id);
    console.log('Request body:', req.body);
    
    const incident = new Incident({
      ...req.body,
      reportedBy: req.user._id
    });
    
    const savedIncident = await incident.save();
    console.log('Created incident:', savedIncident._id);
    
    res.status(201).json(savedIncident);
  } catch (error) {
    console.error('Error in POST /incidents:', error);
    res.status(500).json({ 
      error: 'Failed to create incident',
      details: error.message 
    });
  }
});

// Get incident by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      reportedBy: req.user._id
    }).lean();
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

// Get all incidents (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.email.endsWith('@admin.com')) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .populate('reportedBy', 'username email _id')
      .lean();
    
    console.log('Admin fetched incidents:', incidents.length);
    console.log('Sample incident reporter:', incidents[0]?.reportedBy);
    
    res.json(incidents);
  } catch (error) {
    console.error('Error in GET /incidents/admin/all:', error);
    res.status(500).json({ 
      error: 'Failed to fetch all incidents',
      details: error.message 
    });
  }
});

// Update incident status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (!req.user.email.endsWith('@admin.com')) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const { status } = req.body;
    if (!['new', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    console.error('Error updating incident status:', error);
    res.status(500).json({ error: 'Failed to update incident status' });
  }
});

// Delete incident (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.email.endsWith('@admin.com')) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Error deleting incident:', error);
    res.status(500).json({ error: 'Failed to delete incident' });
  }
});

module.exports = router; 