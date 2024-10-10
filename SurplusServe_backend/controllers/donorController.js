import User from '../models/User.js';
import Donation from '../models/Donation.js';

// Helper function for consistent error responses
const handleError = (res, error, message = 'Server error') => {
    console.error('Error:', error);
    return res.status(500).json({ 
        success: false, 
        message: message,
        error: error.message 
    });
};

export const registerDonor = async (req, res) => {
    const { email, name } = req.body;

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
            role: 'donor',
            registeredAt: new Date()
        });

        await user.save();

        res.status(201).json({ 
            success: true,
            message: 'Donor registered successfully', 
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

export const loginDonor = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required' 
            });
        }

        const user = await User.findOne({ email, role: 'donor' })
            .select('-__v'); // Exclude version key

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Donor not found' 
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

export const getDonorDashboard = async (req, res) => {
    try {
        const donorId = req.user.id;
        const donations = await Donation.find({ donorId });


        const totalDonations = donations.length;
        const totalQuantity = donations.reduce((sum, donation) => sum + donation.quantity, 0);
        const recentDonations = donations.slice(0, 5);

        res.json({
            totalDonations,
            totalQuantity,
            recentDonations
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

export const createDonation = async (req, res) => {
    try{
        const { foodType, quantity, expirationDate, pickupLocation } = req.body;
        const donorId = req.user.id;

        // Log received data
        console.log('Request body:', req.body);
        console.log('Donor ID:', donorId);

        const images =  req.files ? req.files.map(file => file.path) : [];

        const newDonation = new Donation({
            donorId,
            foodType,
            quantity,
            expirationDate,
            images,
            pickupLocation,
            // status: 'available'
        });

        await newDonation.save();

        res.status(201).json({
            msg: 'Donation created successfully',
            donation: newDonation
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};