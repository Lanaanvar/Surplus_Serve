import express from "express";
import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import Donor from "../models/Donor.js";
import { getDonorDashboard, createDonation } from "../controllers/donorController.js";
import upload from "../middleware/multer.js";

import Recipient from "../models/Recipient.js";
import { registerRecipient, loginRecipient, getDashboard, claimDonation, searchDonations, getDonationById} from "../controllers/recipientController.js";


const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);


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

router.get('/dashboard', auth, donorController.getDonorDashboard);
router.post('/donate', auth, upload.array('images', 5) , donorController.createDonation);


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

router.get('/dashboard', auth, recipientController.getDashboard);
router.post('/claim/:id', auth, recipientController.claimDonation);
router.post('/search', auth, recipientController.searchDonations);
router.get('/dashboard/:id', auth, recipientController.getDonationById);


export default router;
