import { Router } from "express";
import {registerRecipient, loginRecipient} from "../controllers/recipientController.js";

const router = Router();

router.post('/register', registerRecipient);

router.post('/login', loginRecipient);

export default router;