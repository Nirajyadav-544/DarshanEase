/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register New User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Niraj
 *               email:
 *                 type: string
 *                 example: niraj@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       201:
 *         description: User Registered Successfully
 */
const express = require("express");

const router = express.Router();
const { forgotPasswordOTP, verifyOTP, resetPasswordOTP } = require('../controllers/authController');


const {
    registerUser,
    loginUser,
    registerAdmin,
    registerOrganizer
} = require("../controllers/authController");



// ======================
// Admin Register
// ======================

router.post(
    "/admin/register",
    registerAdmin
);



// ======================
// User Register
// ======================

router.post(
    "/register",
    registerUser
);



// ======================
// Organizer Register
// ======================

router.post(
    "/organizer/register",
    registerOrganizer
);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: niraj@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       200:
 *         description: Login Successful
 */

// ======================
// Login (User + Organizer + Admin)
// ======================

router.post(
    "/login",
    loginUser
);


router.post('/forgot-password-otp', forgotPasswordOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password-otp', resetPasswordOTP);

module.exports = router;