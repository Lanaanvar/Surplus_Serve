import express from "express";
import { Router } from "express";
import auth from "../middleware/auth.js";
import Recipient from "../models/Recipient.js";

const router = Router();

router.get('/profile', auth, async (req, res) => {
    try {
        const recipients = await Recipient.findOne({ user: req.user.id }).populate('user', ['email']);

        if (!recipients) {
            return res.status(400).json({ msg: 'No recipients found' });
        }

        res.json(recipients);
    } catch (error) {
        console.error(err.message);
        next(err);   
    }
});


export default router;