const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, username } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (username) updates.username = username;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Delete user account
router.delete('/profile', auth, async (req, res) => {
  try {
    // Delete all incidents associated with the user
    await Incident.deleteMany({ reportedBy: req.user._id });
    
    // Delete the user
    const user = await User.findByIdAndDelete(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Get top 10 users by report count
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const topUsers = await User.aggregate([
      {
        $lookup: {
          from: 'incidents',
          localField: '_id',
          foreignField: 'reportedBy',
          as: 'reports'
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          reportCount: { $size: '$reports' }
        }
      },
      {
        $sort: { reportCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Format the response to show usernames
    const formattedUsers = topUsers.map(user => ({
      _id: user._id,
      name: user.username, // Use username as name
      reportCount: user.reportCount
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

module.exports = router; 