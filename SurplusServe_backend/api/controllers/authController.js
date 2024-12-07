import User from "../models/User.js";
import Donor from "../models/Donor.js";
import Recipient from "../models/Recipient.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try{
        const { email, password, role, name, organization, phone } = req.body;

        if (!email || !password || !role || !name) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({
            email,
            password,
            role
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        if (role === 'donor') {
            const donor = new Donor({
                user: user.id,
                name,
                organization,
                phone
            });
            await donor.save();
        } else if (role === 'recipient') {
            const recipient = new Recipient({
                user: user.id,
                name,
                organization,
                phone
            });
            await recipient.save();
        } else {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        let user = await User.findOne({ email });
        if (!user) { 
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};