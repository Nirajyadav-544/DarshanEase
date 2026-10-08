const mongoose = require('mongoose');

const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidISODate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(
    `${date}T00:00:00.000Z`
  );

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
};

const DEFAULT_TOTAL_SEATS = 100;

/*
 * आज (same-day) के लिए tickets उपलब्ध नहीं होतीं — केवल कल और उसके
 * आगे की dates के लिए auto-provisioning होती है।
 */
const DEFAULT_TIME_SLOTS = [
  { startTime: '06:00 AM', endTime: '09:00 AM' },
  { startTime: '10:00 AM', endTime: '01:00 PM' },
  { startTime: '04:00 PM', endTime: '07:00 PM' },
];

const formatSlot = (slot) => {
  const totalSeats = Number(slot.totalSeats || 0);
  const availableSeats = Math.max(
    0,
    Number(slot.availableSeats || 0)
  );

  return {
    _id: slot._id,
    slotId: slot._id,
    templeId: slot.templeId,
    date: slot.date,

    startTime: slot.startTime,
    endTime: slot.endTime,

    time: `${slot.startTime} - ${slot.endTime}`,
    slotName: `${slot.startTime} - ${slot.endTime}`,

    totalSeats,
    totalCapacity: totalSeats,

    availableSeats,
    available: availableSeats,

    status:
      availableSeats <= 0
        ? 'Full'
        : 'Available',
  };
};

/*
 * =========================================================================
 * 1. GET DATE-WISE SLOT AVAILABILITY
 *
 * Supported URLs:
 *
 * GET /api/booking/availability?templeId=...&date=2026-08-21
 *
 * GET /api/booking/availability/:templeId/2026-08-21
 * =========================================================================
 */
const getAvailability = async (req, res) => {
  try {
    /*
     * Query format और path format दोनों support होंगे।
     */
    const templeId =
      req.query.templeId || req.params.templeId;

    const date =
      req.query.date || req.params.date;

    if (!templeId || !date) {
      return res.status(400).json({
        success: false,
        message:
          'templeId and date are required.',
      });
    }

    if (!isValidObjectId(templeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid templeId.',
      });
    }

    if (!isValidISODate(date)) {
      return res.status(400).json({
        success: false,
        message:
          'Date must use YYYY-MM-DD format.',
      });
    }

    const templeDoc = await Temple.findById(
      templeId
    ).lean();

    if (!templeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found.',
      });
    }

    /*
     * आज के लिए tickets उपलब्ध नहीं — केवल कल और उसके आगे booking
     * allowed है।
     */
    const todayISODate = new Date()
      .toISOString()
      .slice(0, 10);

    if (date === todayISODate) {
      return res.status(200).json({
        success: true,
        templeId,
        date,
        slots: [],
        slotsAvailability: [],
        totalAvailableSeats: 0,
        dateAvailable: false,
        message:
          'Same-day tickets are not available. Please choose a date from tomorrow onward.',
      });
    }

    /*
     * केवल selected temple और selected date के slots।
     */
    let activeSlots = await DarshanSlot.find({
      templeId,
      date,
    })
      .sort({
        startTime: 1,
      })
      .lean();

    /*
     * कल या उसके आगे की किसी date के लिए अगर कोई slot exist नहीं
     * करता, तो असली default slots database में auto-create कर दिए
     * जाते हैं — ताकि organizer को हर दिन manually slot बनाने की
     * ज़रूरत न पड़े, और ticket हमेशा एक valid, real slotId के साथ
     * booking-ready रहे।
     */
    if (
      activeSlots.length === 0 &&
      date > todayISODate
    ) {
      try {
        const created = await DarshanSlot.insertMany(
          DEFAULT_TIME_SLOTS.map(
            ({ startTime, endTime }) => ({
              templeId,
              date,
              startTime,
              endTime,
              totalSeats: DEFAULT_TOTAL_SEATS,
              availableSeats: DEFAULT_TOTAL_SEATS,
            })
          ),
          { ordered: false }
        );

        activeSlots = created.map((doc) =>
          doc.toObject()
        );
      } catch (provisionError) {
        // Duplicate-key races (two requests auto-provisioning the
        // same date at once) or a transient DB error — refetch
        // instead of failing the whole request.
        console.warn(
          'Auto-provisioning DarshanSlot failed or raced, refetching:',
          provisionError.message
        );

        activeSlots = await DarshanSlot.find({
          templeId,
          date,
        })
          .sort({ startTime: 1 })
          .lean();
      }
    }

    const slotsAvailability =
      activeSlots.map(formatSlot);

    const totalAvailableSeats =
      slotsAvailability.reduce(
        (total, slot) =>
          total + Number(slot.availableSeats || 0),
        0
      );

    return res.status(200).json({
      success: true,
      templeId,
      date,
      slots: slotsAvailability,
      slotsAvailability,
      totalAvailableSeats,
      dateAvailable:
        slotsAvailability.length > 0,
    });
  } catch (error) {
    console.error(
      'Availability controller error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to load ticket availability.',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};

/*
 * =========================================================================
 * 2. CREATE BOOKING WITH ATOMIC SEAT RESERVATION
 * =========================================================================
 */
const createBooking = async (req, res) => {
  let reservedSlotId = null;
  let reservedQuantity = 0;

  try {
    const {
      templeId,
      slotId,
      bookingDate,
      visitorName,
      visitorPhone,
      numberOfPeople,
      amount,
      bookingId,
    } = req.body;

    /*
     * User ID केवल authenticated user से लें।
     * req.body.userId पर भरोसा न करें।
     */
    const userId = req.user?._id || req.user?.id;

    if (
      !userId ||
      !templeId ||
      !slotId ||
      !bookingDate ||
      !visitorName ||
      !visitorPhone ||
      !numberOfPeople
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Authenticated user, templeId, slotId, bookingDate, visitorName, visitorPhone and numberOfPeople are required.',
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authenticated user ID.',
      });
    }

    if (!isValidObjectId(templeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid templeId.',
      });
    }

    if (!isValidObjectId(slotId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slotId.',
      });
    }

    if (!isValidISODate(bookingDate)) {
      return res.status(400).json({
        success: false,
        message:
          'bookingDate must use YYYY-MM-DD format.',
      });
    }

    const quantity = Number(numberOfPeople);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message:
          'numberOfPeople must be a positive integer.',
      });
    }

    /*
     * यह verify करता है कि slot इसी temple और selected date
     * से संबंधित है।
     */
    const targetSlot = await DarshanSlot.findOne({
      _id: slotId,
      templeId,
      date: bookingDate,
    });

    if (!targetSlot) {
      return res.status(404).json({
        success: false,
        message:
          'Selected slot is not available for this temple and date.',
      });
    }

    /*
     * Atomic reservation:
     *
     * availableSeats >= quantity होने पर ही seats decrement होंगी।
     * Concurrent requests में यही database-level condition
     * overbooking रोकती है।
     */
    const reservedSlot =
      await DarshanSlot.findOneAndUpdate(
        {
          _id: slotId,
          templeId,
          date: bookingDate,
          availableSeats: {
            $gte: quantity,
          },
        },
        {
          $inc: {
            availableSeats: -quantity,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!reservedSlot) {
      return res.status(409).json({
        success: false,
        message:
          'Not enough tickets are available for the selected date and slot.',
      });
    }

    reservedSlotId = reservedSlot._id;
    reservedQuantity = quantity;

    const uniqueBookingId =
      bookingId ||
      `DE-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    /*
     * Booking model में bookingDate field होना चाहिए।
     */
    const newConfirmedPass = new Booking({
      userId,
      templeId,
      slotId,
      bookingDate,
      visitorName: visitorName.trim(),
      visitorPhone: visitorPhone.trim(),
      numberOfPeople: quantity,
      bookingId: uniqueBookingId,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      amount:
        Number(amount) || quantity * 250,
      qrCode: `QR-${uniqueBookingId}`,
      ticket: `DIGITAL-PASS-${uniqueBookingId}`,
    });

    await newConfirmedPass.save();

    return res.status(201).json({
      success: true,
      message:
        'Darshan booking secured successfully.',
      booking: newConfirmedPass,
      availability: {
        date: bookingDate,
        slotId,
        availableSeats:
          reservedSlot.availableSeats,
      },
    });
  } catch (error) {
    console.error(
      'Create booking error:',
      error
    );

    /*
     * यदि seats decrement हो गईं लेकिन Booking save fail हुआ,
     * तो seats rollback करें।
     */
    if (reservedSlotId && reservedQuantity > 0) {
      try {
        await DarshanSlot.findByIdAndUpdate(
          reservedSlotId,
          {
            $inc: {
              availableSeats: reservedQuantity,
            },
          },
          {
            runValidators: true,
          }
        );
      } catch (rollbackError) {
        console.error(
          'Seat rollback failed:',
          rollbackError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        'Booking could not be completed.',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};

/*
 * =========================================================================
 * 3. GET CURRENT USER BOOKINGS
 * =========================================================================
 */
const myBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message:
          'Authenticated user not found.',
      });
    }

    const bookings = await Booking.find({
      userId,
    })
      .populate(
        'templeId',
        'name location image'
      )
      .populate(
        'slotId',
        'date startTime endTime'
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      'My bookings error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Unable to load your bookings.',
    });
  }
};

module.exports = {
  createBooking,
  getAvailability,
  myBookings,
};
