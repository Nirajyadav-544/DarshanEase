const express = require("express");

const router = express.Router();

const {
    registerOrganizer,
    loginOrganizer,
    dashboard,
    addTemple,
    getMyTemples,
    updateTemple,
    deleteTemple
} = require("../controllers/organizerController");


const organizerOnly = require("../middleware/organizerMiddleware");

const upload = require("../middleware/uploadMiddleware");


/**
 * @swagger
 * tags:
 *   name: Organizer Temple
 *   description: Organizer Temple Management APIs
 */




/**
 * @swagger
 * tags:
 *   name: Organizer
 *   description: Organizer Management APIs
 */





/**
 * @swagger
 * /api/organizer/register:
 *   post:
 *     summary: Register Organizer
 *     tags: [Organizer]
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
 *                 example: Kashi Organizer
 *
 *               email:
 *                 type: string
 *                 example: organizer@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *
 *     responses:
 *       201:
 *         description: Organizer Registered Successfully
 */

router.post(
    "/register",
    registerOrganizer
);



/**
 * @swagger
 * /api/organizer/login:
 *   post:
 *     summary: Organizer Login
 *     tags: [Organizer]
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
 *               email:
 *                 type: string
 *                 example: organizer@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *
 *     responses:
 *       200:
 *         description: Login Successful
 */

router.post(
    "/login",
    loginOrganizer
);



/**
 * @swagger
 * /api/organizer/dashboard:
 *   get:
 *     summary: Organizer Dashboard Analytics
 *     tags: [Organizer]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Dashboard Data
 *
 *       401:
 *         description: Unauthorized
 */

router.get(
    "/dashboard",
    organizerOnly,
    dashboard
);



/**
 * @swagger
 * /api/organizer/temples:
 *   post:
 *     summary: Add New Temple
 *     tags: [Organizer Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kedarnath Temple
 *
 *               location:
 *                 type: string
 *                 example: Uttarakhand
 *
 *               description:
 *                 type: string
 *                 example: Famous Shiva Temple
 *
 *               image:
 *                 type: string
 *                 format: binary
 *
 *
 *     responses:
 *       201:
 *         description: Temple Added Successfully
 */

router.post(
    "/temples",
    organizerOnly,
    upload.single("image"),
    addTemple
);



/**
 * @swagger
 * /api/organizer/temples/my:
 *   get:
 *     summary: Get Organizer Own Temples
 *     tags: [Organizer Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Organizer Temple List
 */

router.get(
    "/temples",
    organizerOnly,
    getMyTemples
);


/**
 * @swagger
 * /api/organizer/temples/{id}:
 *   put:
 *     summary: Update Temple
 *     tags: [Organizer Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         multipart/form-data:
 *
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *
 *               location:
 *                 type: string
 *
 *               description:
 *                 type: string
 *
 *               image:
 *                 type: string
 *                 format: binary
 *
 *
 *     responses:
 *       200:
 *         description: Temple Updated Successfully
 */

router.put(
    "/temple/:id",
    organizerOnly,
    upload.single("image"),
    updateTemple
);



/**
 * @swagger
 * /api/organizer/temples/{id}:
 *   delete:
 *     summary: Delete Temple
 *     tags: [Organizer Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *
 *     responses:
 *       200:
 *         description: Temple Deleted Successfully
 */

router.delete(
    "/temple/:id",
    organizerOnly,
    deleteTemple
);



module.exports = router;