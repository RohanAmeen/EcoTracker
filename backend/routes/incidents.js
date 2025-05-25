const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Incident = require('../models/Incident');

// Create incident
router.post('/', auth, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('location.coordinates').isArray().isLength(2),
  body('category').isIn(['pollution', 'deforestation', 'wildlife', 'waste', 'other']),
  body('severity').isIn(['low', 'medium', 'high', 'critical'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = new Incident({
      ...req.body,
      reportedBy: req.user._id
    });

    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('reportedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get incident by ID
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'username');
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update incident
router.patch('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Check if user is the reporter
    if (incident.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'category', 'severity', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => incident[update] = req.body[update]);
    incident.updatedAt = Date.now();
    
    await incident.save();
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete incident
router.delete('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Check if user is the reporter
    if (incident.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await incident.remove();
    res.json({ message: 'Incident deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 