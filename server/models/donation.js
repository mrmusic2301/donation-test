const mongoose = require('mongoose');

let donationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
});

module.exports = mongoose.model('donation', donationSchema, 'donations');