const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const Activity = require('../models/Activity');

// @route   GET api/activities
// @desc    Get all activities for a user
router.get('/', auth, async (req, res) => {
  try {
    // Sorting by date string ascending
    const activities = await Activity.find({ user: req.user.id }).sort({ dateKey: 1 });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/activities
// @desc    Add new activity/booking
router.post('/', auth, async (req, res) => {
  try {
    const newActivity = new Activity({
      user: req.user.id,
      ...req.body // Spreading the body to grab dateKey, activityId, startTime, etc.
    });

    const activity = await newActivity.save();
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/activities/:id
// @desc    Delete an activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ msg: 'Activity not found' });

    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;