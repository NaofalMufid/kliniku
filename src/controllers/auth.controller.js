import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createColorizedLogger } from '../helper/helper.js';

const logger = createColorizedLogger();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username matches
        if (username !== process.env.ADMIN_USERNAME) {
            return res.status(401).json({ message: 'Invalid username' });
        }
        const hashedPassword = process.env.ADMIN_PASSWORD;
        
        // Compare the provided password with hashed stored password
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        logger.info(`User ${username} successfully logged in`);
        res.status(200).json({
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { login }; 