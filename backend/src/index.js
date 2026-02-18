require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Semester = require('./models/Semester');
const Holiday = require('./models/Holiday');

const app = express();
app.use(cors());
app.use(express.json());

// NOTE: simplified server for beginners — admin UI is gated by Clerk on the frontend only.
// Server focuses on minimal, clear routes and uses models directly (no controllers/routes folders).

// Semesters
app.get('/api/semesters', async (req, res) => {
  const list = await Semester.find().sort({ createdAt: -1 });
  res.json(list);
});

app.get('/api/semesters/:id', async (req, res) => {
  const s = await Semester.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'not found' });
  res.json(s);
});

app.post('/api/semesters', async (req, res) => {
  const { name, mid1Date, mid2Date } = req.body;
  if (!name) return res.status(400).json({ message: 'Semester name is required' });
  if (mid1Date && mid2Date) {
    const m1 = new Date(mid1Date);
    const m2 = new Date(mid2Date);
    if (m1 > m2) return res.status(400).json({ message: 'Mid1 date must be before Mid2 date' });
  }
  const sem = await Semester.create({ name, mid1Date, mid2Date });
  res.status(201).json(sem);
});

app.put('/api/semesters/:id', async (req, res) => {
  const updated = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'not found' });
  res.json(updated);
});

app.delete('/api/semesters/:id', async (req, res) => {
  await Semester.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

// Holidays
app.get('/api/holidays', async (req, res) => {
  const { semesterId } = req.query;
  const query = semesterId ? { semesterId } : {};
  const list = await Holiday.find(query).sort({ startDate: 1 });
  res.json(list);
});

app.post('/api/holidays', async (req, res) => {
  const { semesterId, name, startDate, endDate } = req.body;
  if (!semesterId || !name || !startDate || !endDate) return res.status(400).json({ message: 'All fields are required: semesterId, name, startDate, endDate' });
  
  const s = new Date(startDate);
  const e = new Date(endDate);
  
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return res.status(400).json({ message: 'Invalid date format' });
  if (s > e) return res.status(400).json({ message: 'Start date must be before or equal to end date' });

  // prevent overlap for same semester
  const existing = await Holiday.find({ semesterId });
  for (const h of existing) {
    const aS = new Date(h.startDate), aE = new Date(h.endDate);
    if (s <= aE && aS <= e) return res.status(400).json({ message: 'Holiday overlaps with an existing holiday for this semester' });
  }

  const hol = await Holiday.create({ semesterId, name, startDate: s, endDate: e });
  res.status(201).json(hol);
});

app.put('/api/holidays/:id', async (req, res) => {
  const { startDate, endDate, name } = req.body;
  if (startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return res.status(400).json({ message: 'Invalid date format' });
    if (s > e) return res.status(400).json({ message: 'Start date must be before or equal to end date' });
  }
  const updated = await Holiday.findByIdAndUpdate(req.params.id, { startDate, endDate, name }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Holiday not found' });
  res.json(updated);
});

app.delete('/api/holidays/:id', async (req, res) => {
  await Holiday.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to connect to DB', err);
  process.exit(1);
});
