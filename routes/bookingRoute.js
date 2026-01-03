const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    console.log('\n[DB WRITE] Attempting to create new booking...');
    console.log('[DB WRITE] Booking data received:', req.body);
    
    const booking = new Booking(req.body);
    console.log('[DB WRITE] Writing to database: Bookings collection');
    const savedBooking = await booking.save();
    console.log('[DB WRITE] ✓ Booking created successfully!');
    console.log('[DB WRITE] Booking ID:', savedBooking._id);
    console.log('[DB WRITE] Created at:', new Date().toISOString());
    
    res.json(savedBooking);
  } catch (error) {
    console.error('[DB WRITE] ✗ Error creating booking:', error.message);
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
    const bookingId = req.params.id;
    console.log('\n[DB WRITE] Attempting to update booking...');
    console.log('[DB WRITE] Booking ID:', bookingId);
    console.log('[DB WRITE] Update data:', req.body);
    
    console.log('[DB WRITE] Updating in database: Bookings collection');
    const booking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
    
    if (!booking) {
      console.log('[DB WRITE] ✗ Booking not found in database');
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log('[DB WRITE] ✓ Booking updated successfully!');
    console.log('[DB WRITE] Updated booking ID:', booking._id);
    console.log('[DB WRITE] Updated at:', new Date().toISOString());
    
    res.json(booking);
  } catch (error) {
    console.error('[DB WRITE] ✗ Error updating booking:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Delete a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log('\n[DB WRITE] Attempting to delete booking...');
    console.log('[DB WRITE] Booking ID:', bookingId);
    
    console.log('[DB WRITE] Deleting from database: Bookings collection');
    const booking = await Booking.findByIdAndRemove(bookingId);
    
    if (!booking) {
      console.log('[DB WRITE] ✗ Booking not found in database');
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log('[DB WRITE] ✓ Booking deleted successfully!');
    console.log('[DB WRITE] Deleted booking ID:', booking._id);
    console.log('[DB WRITE] Deleted at:', new Date().toISOString());
    
    res.json(booking);
  } catch (error) {
    console.error('[DB WRITE] ✗ Error deleting booking:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
