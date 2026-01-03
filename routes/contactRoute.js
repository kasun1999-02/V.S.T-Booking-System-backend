const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts');

router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    console.log('\n[DB WRITE] Attempting to create new contact...');
    console.log('[DB WRITE] Contact data received:', {
      fullName,
      email,
      message: message?.substring(0, 50) + '...' // Truncate long messages
    });

    if (!fullName || !email || !message) {
      console.log('[DB WRITE] ✗ Validation failed: Missing required fields');
      return res.status(400).json({
        message: "Please provide all required fields."
      });
    }

    const newContact = {
      fullName,
      email,  
      message
    };

    console.log('[DB WRITE] Writing to database: Contacts collection');
    const createdContact = await Contact.create(newContact);
    console.log('[DB WRITE] ✓ Contact created successfully!');
    console.log('[DB WRITE] Contact ID:', createdContact._id);
    console.log('[DB WRITE] Created at:', new Date().toISOString());
    
    return res.status(201).json(createdContact);
  } catch (error) {
    console.error('[DB WRITE] ✗ Error creating contact:', error.message);
    console.error(error);
    return res.status(500).json({
      message: error.message
    });
  }
});


 


module.exports = router;