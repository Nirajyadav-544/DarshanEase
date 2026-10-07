const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple ID is required'],
      index: true,
    },

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Made optional: system auto-provisioned slots (see
      // adminEndpoints.js) don't always have a human organizer behind
      // them, so this can no longer block slot creation.
      index: true,
    },

    /*
     * Date हमेशा YYYY-MM-DD format में store करें।
     * Example: 2026-08-21
     */
    date: {
      type: String,
      required: [true, 'Booking date is required'],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        'Date must use YYYY-MM-DD format',
      ],
      index: true,
    },

    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true,
    },

    endTime: {
      type: String,
      required: [true, 'End time is required'],
      trim: true,
    },

    maxVisitors: {
      type: Number,
      required: [true, 'Maximum visitors are required'],
      min: [1, 'Maximum visitors must be at least 1'],
    },

    bookedVisitors: {
      type: Number,
      default: 0,
      min: [0, 'Booked visitors cannot be negative'],
      validate: {
        validator(value) {
          return value <= this.maxVisitors;
        },
        message:
          'Booked visitors cannot exceed maximum visitors',
      },
    },

    status: {
      type: String,
      enum: ['Available', 'Full', 'Closed'],
      default: 'Available',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * एक मंदिर में एक date और same time range का duplicate slot
 * create नहीं होने देगा।
 */
slotSchema.index(
  {
    templeId: 1,
    date: 1,
    startTime: 1,
    endTime: 1,
  },
  {
    unique: true,
  }
);

/*
 * Available seats virtual field है:
 * maxVisitors - bookedVisitors
 */
slotSchema.virtual('availableSeats').get(function () {
  return Math.max(
    0,
    this.maxVisitors - this.bookedVisitors
  );
});

slotSchema.set('toJSON', {
  virtuals: true,
});

slotSchema.set('toObject', {
  virtuals: true,
});

/*
 * Save/update से पहले status automatically synchronize करें।
 *
 * FIX: pre('validate') hooks in Mongoose do not reliably support the
 * next()-callback pattern the way pre('save') does — validation already
 * runs through an internal promise chain. Declaring a `next` parameter
 * and calling next() here caused "TypeError: next is not a function"
 * on every save, which silently prevented every slot from ever being
 * created. Since this logic is fully synchronous (no async/DB calls),
 * the fix is to drop the next parameter entirely and just let the
 * function return normally.
 */
slotSchema.pre('validate', function () {
  if (this.status !== 'Closed') {
    this.status =
      this.bookedVisitors >= this.maxVisitors
        ? 'Full'
        : 'Available';
  }
});

module.exports = mongoose.model('Slot', slotSchema);