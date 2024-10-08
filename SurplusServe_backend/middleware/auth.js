import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({ msg: 'Token is not valid' });
    }
}