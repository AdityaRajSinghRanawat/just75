const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mid1Date: { type: Date },
  mid2Date: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Semester', SemesterSchema);
