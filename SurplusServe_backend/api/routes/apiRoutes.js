const express = require("express");
const Router = express.Router;
const auth = require("../middleware/auth.js");
const authController = require("../controllers/authController.js");
const donorController = require("../controllers/donorController.js");
const recipientController = require("../controllers/recipientController.js");
const upload = require("../middleware/multer.js");

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/donor/dashboard', auth, donorController.getDonorDashboard);
router.post('/donor/donate', auth, upload.array('images', 5), donorController.createDonation);

router.get('/recipient/dashboard', auth, recipientController.getDashboard);
router.post('/recipient/claim/:id', auth, recipientController.claimDonation);
router.post('/recipient/search', auth, recipientController.searchDonations);
router.get('/recipient/dashboard/:id', auth, recipientController.getDonationById);

module.exports = router;