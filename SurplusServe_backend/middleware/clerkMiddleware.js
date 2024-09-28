import { requireSession, getAuth } from '@clerk/clerk-sdk-node';
import User from '../models/userModel.js'; 

export const clerkMiddleware = requireSession();  // Use requireSession as a middleware

export const checkUserRole = async (req, res, next) => {
    try {

        const auth = getAuth(req);

        if (!auth) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const {userId} = auth;

        const user = await User.findOne({ clerkUserId: userId });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        //Attach user to the request object
        req.user = user;

        //proceed to the next middleware 
        next();
    } catch (error) {
        console.error('Error checking user role :', error);
        res.status(500).json({ message: 'Server error during role verification' });
    }
}
export default clerkMiddleware;
