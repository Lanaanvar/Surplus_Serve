import User from '../models/userModel.js';
import Donation from '../models/donationModel.js';

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

export const createDonation = async (req, res) => {
    const { foodType, quantity, expirationDate, location } = req.body;
    
    try {
        // Input validation
        if (!foodType || !quantity || !expirationDate || !location) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide all required fields' 
            });
        }

        // Validate expiration date
        const expDate = new Date(expirationDate);
        if (expDate < new Date()) {
            return res.status(400).json({ 
                success: false,
                message: 'Expiration date cannot be in the past' 
            });
        }

        // Process images if they exist
        const images = req.files ? req.files.map(file => file.path) : [];

        // Calculate meals provided (you can adjust the formula)
        const mealsProvided = Math.floor(quantity * 2); // Example calculation
        const foodWastedReduced = quantity; // In kg or appropriate unit

        const donation = new Donation({
            foodType,
            quantity,
            expirationDate: expDate,
            images,
            location,
            mealsProvided,
            foodWastedReduced,
            status: 'available',
            createdAt: new Date(),
            claimedBy: req.user.email,
        });

        await donation.save();

        // Update user's donation count
        await User.findByIdAndUpdate(req.user.email, {
            $inc: { totalDonations: 1 }
        });

        res.status(201).json({ 
            success: true,
            message: 'Donation created successfully', 
            data: donation 
        });
    } catch (error) {
        return handleError(res, error, 'Error creating donation');
    }
};

export const getDonationsSummary = async (req, res) => {
    try {
        const donorId = req.user.id;

        // Get donations with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all donations for statistics
        const allDonations = await Donation.find({ donorId });

        // Get paginated donations
        const donations = await Donation.find({ donorId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate statistics
        const stats = {
            totalDonations: allDonations.length,
            totalMealsProvided: allDonations.reduce((acc, curr) => acc + (curr.mealsProvided || 0), 0),
            totalFoodWastedReduced: allDonations.reduce((acc, curr) => acc + (curr.foodWastedReduced || 0), 0),
            donationsByStatus: {
                available: allDonations.filter(d => d.status === 'available').length,
                claimed: allDonations.filter(d => d.status === 'claimed').length,
                completed: allDonations.filter(d => d.status === 'completed').length
            }
        };

        res.status(200).json({
            success: true,
            data: {
                stats,
                donations,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(allDonations.length / limit),
                    totalItems: allDonations.length,
                    itemsPerPage: limit
                }
            }
        });
    } catch (error) {
        return handleError(res, error, 'Error fetching donations summary');
    }
};

// New function to get a specific donation
export const getDonation = async (req, res) => {
    try {
        const donation = await Donation.findOne({
            _id: req.params.donationId,
            donorId: req.user.id
        });

        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: donation 
        });
    } catch (error) {
        return handleError(res, error, 'Error fetching donation');
    }
};

// New function to update a donation
export const updateDonation = async (req, res) => {
    try {
        const { foodType, quantity, expirationDate, location, status } = req.body;
        
        const donation = await Donation.findOne({
            _id: req.params.donationId,
            donorId: req.user.id
        });

        if (!donation) {
            return res.status(404).json({ 
                success: false,
                message: 'Donation not found' 
            });
        }

        // Only allow updates if donation is not claimed
        if (donation.status === 'claimed' || donation.status === 'completed') {
            return res.status(400).json({ 
                success: false,
                message: 'Cannot update claimed or completed donations' 
            });
        }

        // Update fields if provided
        if (foodType) donation.foodType = foodType;
        if (quantity) donation.quantity = quantity;
        if (expirationDate) donation.expirationDate = new Date(expirationDate);
        if (location) donation.location = location;
        if (status) donation.status = status;

        // Add new images if provided
        if (req.files && req.files.length > 0) {
            donation.images = [...donation.images, ...req.files.map(file => file.path)];
        }

        await donation.save();

        res.status(200).json({ 
            success: true,
            message: 'Donation updated successfully',
            data: donation 
        });
    } catch (error) {
        return handleError(res, error, 'Error updating donation');
    }
};

export const getDonationStats = async (req, res) => {
    try {
        const stats = await Donation.getStatistics(req.user.id);
        res.status(200).json({
            success: true,
            data: stats[0] // First element of aggregate result
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};