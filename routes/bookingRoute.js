const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.json(savedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a specific booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a booking by ID
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndRemove(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
