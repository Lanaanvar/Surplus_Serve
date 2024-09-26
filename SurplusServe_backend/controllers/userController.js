import User from '../models/userModel.js';

export async function getUser(req, res) {
    const {userId} = req.auth;

    try {
        const user = await findOne({clerkUserId: userId});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
}

export async function createUser(req, res) {
    const {userId} = req.auth;
    const {email, name} = req.body;

    try {
        const newUser = new User({
            clerkUserId: userId,
            email,
            name
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message : 'Error creating user'});
    }
}