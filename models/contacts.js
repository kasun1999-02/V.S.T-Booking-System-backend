 // contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  // You can add more fields as needed
});

const Contact = mongoose.model('Contacts', contactSchema);

module.exports = Contact;
