import express from "express";
import { Router } from "express";
import auth from "../middleware/auth.js";
import * as authController from "../controllers/authController.js";
import * as donorController from "../controllers/donorController.js";
import * as recipientController from "../controllers/recipientController.js";
import upload from "../middleware/multer.js";


const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);


// router.get('/profile', auth, async (req, res) => {
//     try {
//         const donors = await Donor.findOne({ user: req.user.id }).populate('user', ['email']);

//         if (!donors) {
//             return res.status(400).json({ msg: 'No donors found' });
//         }

//         res.json(donors);
//     } catch (error) {
//         console.error(err.message);
//         next(err);   
//     }
// });

router.get('/donor/dashboard', auth, donorController.getDonorDashboard);
router.post('/donor/donate', auth, upload.array('images', 5) , donorController.createDonation);


// router.get('/profile', auth, async (req, res) => {
//     try {
//         const recipients = await Recipient.findOne({ user: req.user.id }).populate('user', ['email']);

//         if (!recipients) {
//             return res.status(400).json({ msg: 'No recipients found' });
//         }

//         res.json(recipients);
//     } catch (error) {
//         console.error(err.message);
//         next(err);   
//     }
// });

router.get('/recipient/dashboard', auth, recipientController.getDashboard);
router.post('/recipient/claim/:id', auth, recipientController.claimDonation);
router.post('/recipient/search', auth, recipientController.searchDonations);
router.get('/recipient/dashboard/:id', auth, recipientController.getDonationById);


export default router;
