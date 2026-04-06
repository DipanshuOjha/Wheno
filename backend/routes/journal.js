const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const Journal = require('../models/Journal');

// @route   GET api/journal
// @desc    Get all journal entries for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.id }).sort({ dateKey: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/journal
// @desc    Add new journal entry
router.post('/', auth, async (req, res) => {
  const { dateKey, title, body, mood } = req.body;

  try {
    const newEntry = new Journal({
      user: req.user.id,
      dateKey,
      title,
      body,
      mood
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/journal/:id
// @desc    Update journal entry
router.put('/:id', auth, async (req, res) => {
  const { title, body, mood } = req.body;

  try {
    let entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    
    // Ensure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    entry = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: { title, body, mood } },
      { new: true }
    );
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/journal/:id
// @desc    Delete journal entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Journal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;