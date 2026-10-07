const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple ID is required'],
      index: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DarshanSlot',
      required: [true, 'Slot ID is required'],
      index: true,
    },

    bookingDate: {
      type: String,
      required: [true, 'Booking date is required'],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        'Booking date must use YYYY-MM-DD format',
      ],
      index: true,
    },

    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
      minlength: [2, 'Visitor name must be at least 2 characters'],
      maxlength: [100, 'Visitor name cannot exceed 100 characters'],
    },

    visitorPhone: {
      type: String,
      required: [true, 'Visitor phone is required'],
      trim: true,
      maxlength: [20, 'Visitor phone cannot exceed 20 characters'],
    },

    numberOfPeople: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'Number of people must be at least 1'],
    },

    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      unique: true,
      index: true,
      trim: true,
    },

    bookingStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Cancelled',
        'Completed',
      ],
      default: 'Pending',
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        'Pending',
        'Paid',
        'Failed',
        'Refunded',
      ],
      default: 'Pending',
      index: true,
    },

    amount: {
      type: Number,
      required: [true, 'Booking amount is required'],
      min: [0, 'Booking amount cannot be negative'],
      default: 0,
    },

    qrCode: {
      type: String,
      default: null,
      trim: true,
    },

    ticket: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Frequently used booking queries.
 */
bookingSchema.index({
  userId: 1,
  bookingDate: -1,
});

bookingSchema.index({
  templeId: 1,
  bookingDate: -1,
});

bookingSchema.index({
  slotId: 1,
  bookingDate: 1,
});

/*
 * Prevent model recompilation when the file is loaded
 * more than once during development.
 */
module.exports =
  mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema);