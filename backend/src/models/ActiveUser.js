const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
      default: '',
      trim: true,
    },
    lastSeen: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ActiveUser', ActiveUserSchema);