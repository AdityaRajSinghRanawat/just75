const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mid1Date: { type: Date },
  mid2Date: { type: Date }
}, { timestamps: true });

SemesterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Semester', SemesterSchema);
