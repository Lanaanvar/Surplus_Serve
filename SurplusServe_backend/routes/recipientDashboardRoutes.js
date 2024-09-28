import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    const userId = req.auth.userId;
    res.json({ message: `Welcome to the recipient dashboard, ${userId}` });
    data:{
        //Recipient specific data
    }
});

export default router;