const express = require("express");

const router = express.Router();


const protectOrganizer =
require("../middleware/organizerMiddleware");


const upload =
require("../middleware/uploadMiddleware");



const {

    addTemple,

    getAllTemples,

    getMyTemples,

    getSingleTemple,

    updateTemple,

    deleteTemple,

    searchTemple


} = require("../controllers/templeController");





/**
 * @swagger
 * tags:
 *   name: Temple
 *   description: Temple Management APIs
 */







/**
 * @swagger
 * /api/temple/add:
 *   post:
 *     summary: Add New Temple
 *     tags: [Temple]
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
 *
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
 *               openingTime:
 *                 type: string
 *                 example: 6 AM
 *
 *               closingTime:
 *                 type: string
 *                 example: 8 PM
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

    "/add",

    protectOrganizer,

    upload.single("image"),

    addTemple

);










/**
 * @swagger
 * /api/temple:
 *   get:
 *     summary: Get All Temples
 *     tags: [Temple]
 *
 *     responses:
 *       200:
 *         description: All Temple List
 */



router.get(

    "/",

    getAllTemples

);










/**
 * @swagger
 * /api/temple/my:
 *   get:
 *     summary: Get Organizer Own Temples
 *     tags: [Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Organizer Temple List
 */



router.get(

    "/my",

    protectOrganizer,

    getMyTemples

);









/**
 * @swagger
 * /api/temple/search:
 *   get:
 *     summary: Search Temple
 *     tags: [Temple]
 *
 *     parameters:
 *
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         example: Kedarnath
 *
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         example: Uttarakhand
 *
 *
 *     responses:
 *       200:
 *         description: Search Result
 */



router.get(

    "/search",

    searchTemple

);










/**
 * @swagger
 * /api/temple/{id}:
 *   get:
 *     summary: Get Single Temple Details
 *     tags: [Temple]
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *         example: 6a666cf167fd606734340278
 *
 *
 *     responses:
 *       200:
 *         description: Temple Found
 *
 *       404:
 *         description: Temple Not Found
 */



router.get(

    "/:id",

    getSingleTemple

);









/**
 * @swagger
 * /api/temple/{id}:
 *   put:
 *     summary: Update Temple
 *     tags: [Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *
 *     responses:
 *       200:
 *         description: Temple Updated Successfully
 */



router.put(

    "/:id",

    protectOrganizer,

    upload.single("image"),

    updateTemple

);









/**
 * @swagger
 * /api/temple/{id}:
 *   delete:
 *     summary: Delete Temple
 *     tags: [Temple]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *
 *     responses:
 *       200:
 *         description: Temple Deleted Successfully
 */



router.delete(

    "/:id",

    protectOrganizer,

    deleteTemple

);






module.exports = router;