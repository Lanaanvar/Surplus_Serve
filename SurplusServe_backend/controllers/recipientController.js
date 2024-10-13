import User from '../models/User.js';
import Donation from '../models/Donation.js';


const handleError = (res, error, message = 'Server error') => {
    console.error('Error:', error);
    return res.status(500).json({ 
        success: false, 
        message: message,
        error: error.message 
    });
};
export const registerRecipient  = async (req, res) => {
    const { email, name} = req.body;

    try {
        // Input validation
        if (!email || !name) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide all required fields' 
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ 
            $or: [
                { email: normalizedEmail },
                // { clerkUserId }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        const user = new User({
            // clerkUserId : clerkUserId.trim(),
            email: email.toLowerCase().trim(),
            name: name.trim(),
            role: 'recipient',
            registeredAt: new Date()
        });

        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Recipient registered successfully', 
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
    
        if (error.code === 11000) {
            const keyPattern = error.keyPattern;
            const keyValue = error.keyValue;
            console.error(`Duplicate key error. Key pattern: ${JSON.stringify(keyPattern)}, Key value: ${JSON.stringify(keyValue)}`);
            return res.status(400).json({ 
                success: false,
                message: 'Registration failed',
                error: `User already exists. Duplicate value for ${Object.keys(keyPattern)[0]}` 
            });
        }
    
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
};

export const loginRecipient = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required' 
            });
        }

        const user = await User.findOne({ email, role: 'recipient' })
            .select('-__v'); // Exclude version key

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Recipient not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Login successful', 
            data: user
        });
    } catch (error) {
        return handleError(res, error, 'Error during login');
    }
};

export const getDashboard = async (req, res) => {
    try {
        console.log('Fetching available donations...');
        const now = new Date();
        const availableDonations = await Donation.find({ status: 'available' }).populate('donorId','organization').sort({ createdAt: -1 }).lean();

        console.log(`Found ${availableDonations.length} available donations`);

        if (availableDonations.length===0) {
            console.log('No available donations found. Checking for all donations...');
            const allDonations = await Donation.find({}).lean();
            console.log(`Total donations: ${allDonations.length}`);
        }

        res.json({ availableDonations });

    } catch (error) {
        console.error("Error fetching available donations :", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const claimDonation = async (req, res) => {
    try{
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.status !== 'available') {
            return res.status(400).json({ message: 'Donation already claimed' });
        }

        donation.status = 'claimed';
        donation.recipient = req.user._id;
        await donation.save();

        res.json({ message: 'Donation claimed successfully', donation });
    } catch (error) {
        console.error("Error claiming donation :", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const searchDonations = async (req, res) => {
    try {
        const {foodType, quantity} = req.body;

        const query = {
            status: 'available',
        };

        if (foodType) {
            query.foodType = { $regex: foodType, $options: 'i' };
        }

        if (quantity) {
            query.quantity = { $gte: parseInt(quantity) };
        }

        const matchingDonations = await Donation.find(query).populate('donorId','organization').sort({ createdAt: -1 });

        res.json({ matchingDonations });
    } catch (error) {
        console.error("Error searching donations :", error);
        res.status(500).json({ message: 'Server error' });
    }
};