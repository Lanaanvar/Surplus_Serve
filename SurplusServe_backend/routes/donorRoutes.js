import { Router } from "express";
import {registerDonor, loginDonor} from "../controllers/donorController.js";

const router = Router();

router.post('/register', registerDonor);

router.post('/login', loginDonor);

export default router;