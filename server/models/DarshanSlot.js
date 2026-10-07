const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple ID is required'],
      index: true,
    },

    /*
     * यदि आपके project में अलग Organizer model है तो
     * ref: 'Organizer' रखें।
     *
     * यदि organizer User model में stored है तो:
     * ref: 'User' करें।
     *
     * FIX: अब यह required नहीं है — कई temple documents के पास
     * कोई organizer/createdBy value ही नहीं है, और auto-provisioned
     * slots (देखें bookingController.js) के पास भी कोई human
     * organizer नहीं होता। required रहने पर हर creation attempt
     * validation पर fail हो जाता था।
     */
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      index: true,
    },

    /*
     * हमेशा YYYY-MM-DD format:
     * 2026-08-21
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

    totalSeats: {
      type: Number,
      required: [true, 'Total seats are required'],
      min: [1, 'Total seats must be at least 1'],
    },

    availableSeats: {
      type: Number,
      required: [true, 'Available seats are required'],
      min: [0, 'Available seats cannot be negative'],
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
 * एक ही temple, date और same time range के duplicate slots
 * database में create नहीं होंगे।
 */
darshanSlotSchema.index(
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
 * Save/update से पहले data consistency maintain करें।
 *
 * FIX: pre('validate') hooks मंगूज़ में next()-callback pattern को
 * reliably support नहीं करते — validation खुद एक internal promise
 * chain से होकर गुज़रती है। यहाँ `next` parameter declare करना और
 * उसे call करना हर single save पर
 * "TypeError: next is not a function" फेंक रहा था, जिससे कभी भी
 * कोई DarshanSlot document बन ही नहीं पाया। यह logic पूरी तरह
 * synchronous है, इसलिए next हटाकर function को सामान्य तरीके से
 * return करने देना ही सही तरीका है।
 */
darshanSlotSchema.pre('validate', function () {
  if (this.availableSeats > this.totalSeats) {
    this.availableSeats = this.totalSeats;
  }

  if (this.availableSeats <= 0) {
    this.status = 'Full';
  } else if (this.status !== 'Closed') {
    this.status = 'Available';
  }
});

module.exports = mongoose.model(
  'DarshanSlot',
  darshanSlotSchema
);