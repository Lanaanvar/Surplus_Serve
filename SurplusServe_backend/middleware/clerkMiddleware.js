import { requireSession } from '@clerk/clerk-sdk-node';

const clerkMiddleware = requireSession();  // Use requireSession as a middleware

export default clerkMiddleware;
