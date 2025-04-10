
const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

// Get all subscriptions for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new subscription
router.post('/', auth, async (req, res) => {
  try {
    const newSubscription = new Subscription({
      ...req.body,
      user: req.user.id
    });

    const subscription = await newSubscription.save();
    res.status(201).json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subscription
router.put('/:id', auth, async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    
    // Check if subscription belongs to user
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subscription
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    
    // Check if subscription belongs to user
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Subscription.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Subscription removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
