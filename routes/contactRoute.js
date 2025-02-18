const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts');

router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "Please provide all required fields."
      });
    }

    const newContact = {
      fullName,
      email,  
      message
    };

    const createdContact = await Contact.create(newContact);
    return res.status(201).json(createdContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message
    });
  }
});


 


module.exports = router;