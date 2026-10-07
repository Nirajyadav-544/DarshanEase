const express = require("express");

const router = express.Router();


const protectOrganizer =
require("../middleware/organizerMiddleware");



const {

    createSlot,

    getTempleSlots,

    getMySlots,

    updateSlot,

    deleteSlot

} = require("../controllers/slotController");





/**
 * @swagger
 * tags:
 *   name: Darshan Slot
 *   description: Darshan Slot Management APIs
 */







// ======================
// Create Slot
// ======================


/**
 * @swagger
 * /api/slot/create:
 *   post:
 *     summary: Create Darshan Slot
 *     tags: [Darshan Slot]
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
 *
 *               templeId:
 *                 type: string
 *                 example: 6a666cf167fd606734340278
 *
 *               date:
 *                 type: string
 *                 example: 2026-08-01
 *
 *               startTime:
 *                 type: string
 *                 example: 6:00 AM
 *
 *               endTime:
 *                 type: string
 *                 example: 8:00 AM
 *
 *               totalSeats:
 *                 type: number
 *                 example: 100
 *
 *
 *     responses:
 *       201:
 *         description: Slot Created Successfully
 */



router.post(

    "/create",

    protectOrganizer,

    createSlot

);










// ======================
// Get Temple Slots
// ======================


/**
 * @swagger
 * /api/slot/temple/{templeId}:
 *   get:
 *     summary: Get Temple Available Slots
 *     tags: [Darshan Slot]
 *
 *     parameters:
 *
 *       - in: path
 *         name: templeId
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
 *         description: Available Slots List
 */



router.get(

    "/temple/:templeId",

    getTempleSlots

);









// ======================
// Organizer Own Slots
// ======================


/**
 * @swagger
 * /api/slot/my-slots:
 *   get:
 *     summary: Get Organizer Own Slots
 *     tags: [Darshan Slot]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Organizer Slots List
 */



router.get(

    "/my-slots",

    protectOrganizer,

    getMySlots

);









// ======================
// Update Slot
// ======================


/**
 * @swagger
 * /api/slot/{id}:
 *   put:
 *     summary: Update Darshan Slot
 *     tags: [Darshan Slot]
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
 *         example: 6a666cf167fd606734340278
 *
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
 *
 *               startTime:
 *                 type: string
 *                 example: 7:00 AM
 *
 *               endTime:
 *                 type: string
 *                 example: 9:00 AM
 *
 *               totalSeats:
 *                 type: number
 *                 example: 150
 *
 *
 *     responses:
 *       200:
 *         description: Slot Updated Successfully
 */



router.put(

    "/:id",

    protectOrganizer,

    updateSlot

);









// ======================
// Delete Slot
// ======================


/**
 * @swagger
 * /api/slot/{id}:
 *   delete:
 *     summary: Delete Darshan Slot
 *     tags: [Darshan Slot]
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
 *         example: 6a666cf167fd606734340278
 *
 *
 *     responses:
 *       200:
 *         description: Slot Deleted Successfully
 */



router.delete(

    "/:id",

    protectOrganizer,

    deleteSlot

);





module.exports = router;