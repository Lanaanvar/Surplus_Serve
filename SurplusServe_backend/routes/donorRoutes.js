import express from "express";
import { Router } from "express";
import auth from "../middleware/auth.js";
import Donor from "../models/Donor.js";

const router = Router();

router.get('/profile', auth, async (req, res) => {
    try {
        const donors = await Donor.findOne({ user: req.user.id }).populate('user', ['email']);

        if (!donors) {
            return res.status(400).json({ msg: 'No donors found' });
        }

        res.json(donors);
    } catch (error) {
        console.error(err.message);
        next(err);   
    }
});


export default router;