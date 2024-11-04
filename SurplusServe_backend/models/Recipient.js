import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema({
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

const Recipient = mongoose.model('Recipient', recipientSchema);

export default Recipient;