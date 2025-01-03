import jwt from 'jsonwebtoken';
import { createColorizedLogger } from '../helper/helper.js';

const logger = createColorizedLogger();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        logger.warn('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error(`Invalid token: ${error.message}`);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export { verifyToken }; 