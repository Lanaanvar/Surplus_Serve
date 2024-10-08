import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodType : {
        type: String,
        required: true
    },
    quantity : {
        type: Number,
        required: true
    },
    expirationDate : {
        type: Date,
        required: true
    },
    images : [{
        type: String
    }],
    pickupLocation : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Donation', donationSchema);