import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    const userId = req.auth.userId;
    res.json({ message: `Welcome to the donor dashboard, ${userId}` });
    data:{
        //Donorspecific data
    }
});

export default router;