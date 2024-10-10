import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donorId : {
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
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'expired'],
        default: 'available',
        required: true
    }
}, { timestamps: true });

donationSchema.index({ status: 1 });

export default mongoose.model('Donation', donationSchema);