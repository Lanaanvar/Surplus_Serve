const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        // required: true,
    },
    phone: {
        type: String,
        // required: true,
    }
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;