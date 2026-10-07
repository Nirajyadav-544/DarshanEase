const express=require("express");

const router=express.Router();


const protectUser=require("../middleware/authMiddleware");



/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management APIs
 */



const {
getProfile,
updateProfile,
changePassword
}=require("../controllers/userController");





/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */



router.get(
"/profile",
protectUser,
getProfile
);








/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update User Profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Niraj Kumar
 *
 *               email:
 *                 type: string
 *                 example: niraj@gmail.com
 *
 *
 *     responses:
 *       200:
 *         description: Profile Updated Successfully
 *
 *       401:
 *         description: Unauthorized
 */



router.put(
"/update",
protectUser,
updateProfile
);








/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change User Password
 *     tags: [User]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 123456
 *
 *               newPassword:
 *                 type: string
 *                 example: 654321
 *
 *
 *     responses:
 *       200:
 *         description: Password Changed Successfully
 *
 *       401:
 *         description: Unauthorized
 */



router.put(
"/change-password",
protectUser,
changePassword
);





module.exports=router;