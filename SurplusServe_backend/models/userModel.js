import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['donor', 'recipient'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = model('User', userSchema);

export default User;