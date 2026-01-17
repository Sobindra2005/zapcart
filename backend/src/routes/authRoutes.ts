import express from 'express';
import { signup, login, refreshAccessToken, logout, updateProfile } from '@/controllers/auth.controller';


const router = express.Router();

/**
 * Authentication routes
 */

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   PATCH /api/v1/auth/update-profile
 * @desc    Update user profile (name, email, avatar, etc. except password)
 * @access  Private (requires authentication)
 */
router.patch('/update-profile', updateProfile);


/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Public
 */
router.post('/logout', logout);



export default router;
