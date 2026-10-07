const mongoose = require('mongoose');

const User = require('../models/User');
const Temple = require('../models/Temple');
const Slot = require('../models/Slot');
const sendEmail = require('./email');

const DEFAULT_SLOT_CAPACITY = 100;

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidISODate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
};

const getSlotAvailableSeats = (slot) => {
  const totalCapacity = Number(slot.totalCapacity || 0);

  if (slot.available !== undefined) {
    return Math.max(0, Number(slot.available));
  }

  if (slot.availableSeats !== undefined) {
    return Math.max(0, Number(slot.availableSeats));
  }

  const bookedQuantity = Number(
    slot.bookedQuantity || slot.booked || 0
  );

  return Math.max(0, totalCapacity - bookedQuantity);
};

const formatSlot = (slot) => {
  const totalCapacity = Number(
    slot.totalCapacity || DEFAULT_SLOT_CAPACITY
  );

  const bookedQuantity = Number(
    slot.bookedQuantity || slot.booked || 0
  );

  const availableSeats = getSlotAvailableSeats(slot);

  return {
    _id: slot._id,
    slotId: slot._id,
    templeId: slot.templeId,
    date: slot.date,
    time: slot.time,
    slotName: slot.slotName || slot.time,
    type: slot.type || 'General Darshan',
    totalCapacity,
    bookedQuantity,
    availableSeats,
    available: availableSeats,
  };
};

const configureAdminOperationsGrid = (app) => {
  /*
   * =========================================================================
   * ORGANIZER TEMPLES
   * =========================================================================
   */

  app.get('/api/organizer/temples', async (req, res) => {
    try {
      const allTemples = await Temple.find({})
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        temples: allTemples,
      });
    } catch (error) {
      console.error(
        'Fetching organizer temples failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Unable to load temples.',
      });
    }
  });

  /*
   * =========================================================================
   * DATE-WISE AVAILABILITY
   *
   * Supported frontend request:
   * GET /api/booking/availability?templeId=...&date=YYYY-MM-DD
   *
   * Also supports:
   * GET /api/public/slots-by-date?templeId=...&date=YYYY-MM-DD
   * GET /api/booking/availability/:templeId/:date
   * =========================================================================
   */

  const getAvailabilityByDate = async (req, res) => {
    try {
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
            'Invalid date. Expected format YYYY-MM-DD.',
        });
      }

      const templeExists = await Temple.exists({
        _id: templeId,
      });

      if (!templeExists) {
        return res.status(404).json({
          success: false,
          message: 'Temple not found.',
        });
      }

      /*
       * Important:
       * Availability केवल इसी temple और इसी selected date से निकलेगी।
       * किसी दूसरे date के slots इसमें शामिल नहीं होंगे।
       */
      const liveSlots = await Slot.find({
        templeId,
        date,
      })
        .sort({ time: 1 })
        .lean();

      const formattedSlots = liveSlots.map(formatSlot);

      return res.status(200).json({
        success: true,
        templeId,
        date,
        slots: formattedSlots,
        slotsAvailability: formattedSlots,
        totalAvailableSeats: formattedSlots.reduce(
          (total, slot) =>
            total + Number(slot.availableSeats || 0),
          0
        ),
      });
    } catch (error) {
      console.error(
        'Date-wise availability failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to fetch ticket availability.',
        error:
          process.env.NODE_ENV === 'development'
            ? error.message
            : undefined,
      });
    }
  };

  app.get(
    '/api/booking/availability',
    getAvailabilityByDate
  );

  app.get(
    '/api/booking/availability/:templeId/:date',
    getAvailabilityByDate
  );

  app.get(
    '/api/public/slots-by-date',
    getAvailabilityByDate
  );

  /*
   * =========================================================================
   * CREATE ORGANIZER SLOT
   * =========================================================================
   */

  app.post('/api/organizer/create-slot', async (req, res) => {
    try {
      const {
        templeId,
        date,
        timeSlot,
        slotType,
        totalCapacity,
      } = req.body;

      if (!templeId || !date || !timeSlot) {
        return res.status(400).json({
          success: false,
          message:
            'templeId, date and timeSlot are required.',
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
            'Invalid date. Expected format YYYY-MM-DD.',
        });
      }

      const parsedCapacity = Number(
        totalCapacity || DEFAULT_SLOT_CAPACITY
      );

      if (
        !Number.isInteger(parsedCapacity) ||
        parsedCapacity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'totalCapacity must be a positive integer.',
        });
      }

      const templeExists = await Temple.exists({
        _id: templeId,
      });

      if (!templeExists) {
        return res.status(404).json({
          success: false,
          message: 'Temple not found.',
        });
      }

      /*
       * Duplicate slot रोकने के लिए same temple/date/time
       * record पहले check किया जा रहा है।
       */
      const duplicateSlot = await Slot.findOne({
        templeId,
        date,
        time: timeSlot,
      });

      if (duplicateSlot) {
        return res.status(409).json({
          success: false,
          message:
            'A slot already exists for this temple, date and time.',
          slot: formatSlot(duplicateSlot),
        });
      }

      const newSlot = await Slot.create({
        templeId,
        date,
        time: timeSlot,
        slotName: timeSlot,
        type: slotType || 'General Darshan',
        totalCapacity: parsedCapacity,
        bookedQuantity: 0,
        available: parsedCapacity,
      });

      await Temple.findByIdAndUpdate(
        templeId,
        {
          $addToSet: {
            slots: newSlot._id,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(201).json({
        success: true,
        message: 'Slot created successfully.',
        slot: formatSlot(newSlot),
      });
    } catch (error) {
      console.error(
        'Create slot failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Unable to create slot.',
        error:
          process.env.NODE_ENV === 'development'
            ? error.message
            : undefined,
      });
    }
  });

  /*
   * =========================================================================
   * DELETE SLOT
   * =========================================================================
   */

  app.delete('/api/organizer/slots/:id', async (req, res) => {
    try {
      const { id: slotId } = req.params;

      if (!isValidObjectId(slotId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid slot ID.',
        });
      }

      const targetSlot = await Slot.findById(slotId);

      if (!targetSlot) {
        return res.status(404).json({
          success: false,
          message: 'Slot not found.',
        });
      }

      await Slot.findByIdAndDelete(slotId);

      if (
        targetSlot.templeId &&
        isValidObjectId(targetSlot.templeId)
      ) {
        await Temple.findByIdAndUpdate(
          targetSlot.templeId,
          {
            $pull: {
              slots: targetSlot._id,
            },
          },
          {
            new: true,
          }
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Slot deleted successfully.',
      });
    } catch (error) {
      console.error(
        'Delete slot failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Unable to delete slot.',
      });
    }
  });

  /*
   * =========================================================================
   * ADD TEMPLE
   * =========================================================================
   */

  app.post('/api/organizer/add-temple', async (req, res) => {
    try {
      const {
        name,
        state,
        location,
        description,
        images,
        image,
        organizer,
        createdBy,
      } = req.body;

      if (!name || !state || !location) {
        return res.status(400).json({
          success: false,
          message:
            'name, state and location are required.',
        });
      }

      const temple = await Temple.create({
        name: name.trim(),
        state: state.trim(),
        location: location.trim(),
        description: description || '',
        image:
          images ||
          image ||
          'https://unsplash.com',
        organizer: organizer || createdBy || undefined,
        createdBy: createdBy || organizer || undefined,
        approvalStatus: 'Pending',
        status: 'Pending',
        slots: [],
      });

      return res.status(201).json({
        success: true,
        message: 'Temple created successfully.',
        temple,
      });
    } catch (error) {
      console.error(
        'Add temple failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Unable to add temple.',
      });
    }
  });

  /*
   * =========================================================================
   * USER STATUS
   * =========================================================================
   */

  app.put('/api/admin/users/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID.',
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status is required.',
        });
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          id,
          {
            status,
            accountStatus: status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      return res.status(200).json({
        success: true,
        message: `Status updated to ${status}.`,
        user: updatedUser,
      });
    } catch (error) {
      console.error(
        'Update user status failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Unable to update user status.',
      });
    }
  });

  /*
   * =========================================================================
   * SINGLE TEMPLE APPROVAL ROUTE
   *
   * Rejected temple को automatically delete नहीं किया जा रहा।
   * इससे accidental permanent data loss नहीं होगा।
   * =========================================================================
   */

  app.put(
    '/api/admin/temples/:id/approval',
    async (req, res) => {
      try {
        const { id } = req.params;
        const { approvalStatus } = req.body;

        if (!isValidObjectId(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid temple ID.',
          });
        }

        if (
          !['Approved', 'Rejected'].includes(
            approvalStatus
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              'approvalStatus must be Approved or Rejected.',
          });
        }

        const updatedTemple =
          await Temple.findByIdAndUpdate(
            id,
            {
              approvalStatus,
              status:
                approvalStatus === 'Approved'
                  ? 'Live'
                  : 'Rejected',
            },
            {
              new: true,
              runValidators: true,
            }
          );

        if (!updatedTemple) {
          return res.status(404).json({
            success: false,
            message: 'Temple not found.',
          });
        }

        const organizerId =
          updatedTemple.organizer ||
          updatedTemple.createdBy;

        if (
          organizerId &&
          isValidObjectId(organizerId)
        ) {
          const organizerUser =
            await User.findById(organizerId).lean();

          if (organizerUser?.email) {
            const isApproved =
              approvalStatus === 'Approved';

            const mailSubject = isApproved
              ? 'Temple application approved'
              : 'Temple application rejected';

            const mailBody = isApproved
              ? `<h3>Hello ${organizerUser.name || 'Organizer'},</h3>
                 <p>Your temple <b>${updatedTemple.name}</b>
                 is now live for devotee bookings.</p>`
              : `<h3>Hello ${organizerUser.name || 'Organizer'},</h3>
                 <p>Your temple <b>${updatedTemple.name}</b>
                 application was rejected.</p>`;

            try {
              await sendEmail(
                organizerUser.email,
                mailSubject,
                mailBody
              );
            } catch (emailError) {
              console.error(
                'Approval email failed:',
                emailError
              );
            }
          }
        }

        return res.status(200).json({
          success: true,
          message: `Temple status updated to ${approvalStatus}.`,
          temple: updatedTemple,
        });
      } catch (error) {
        console.error(
          'Temple approval failed:',
          error
        );

        return res.status(500).json({
          success: false,
          message: 'Unable to update temple approval.',
        });
      }
    }
  );

  /*
   * =========================================================================
   * ORGANIZER SLOTS
   * =========================================================================
   */

  app.get('/api/organizer/my-slots', async (req, res) => {
    try {
      const slots = await Slot.find({})
        .sort({
          date: 1,
          time: 1,
        })
        .lean();

      return res.status(200).json({
        success: true,
        slots: slots.map(formatSlot),
      });
    } catch (error) {
      console.error(
        'Fetching organizer slots failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Unable to load slots.',
      });
    }
  });

  /*
   * =========================================================================
   * ANALYTICS
   *
   * Fake revenue data हटाया गया है।
   * Real analytics के लिए Booking model से aggregation लगानी होगी।
   * =========================================================================
   */

  app.get('/api/organizer/analytics', async (req, res) => {
    return res.status(200).json({
      success: true,
      revenueData: [],
      message:
        'Analytics aggregation is not configured yet.',
    });
  });
};

module.exports = configureAdminOperationsGrid;