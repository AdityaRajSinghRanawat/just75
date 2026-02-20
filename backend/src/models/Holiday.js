const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', default: null },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

HolidaySchema.index({ semesterId: 1, startDate: 1 });

module.exports = mongoose.model('Holiday', HolidaySchema);
