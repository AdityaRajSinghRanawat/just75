import connectDB from '../backend/src/db.js';
import app from '../backend/src/app.js';

let dbPromise;

export default async function handler(req, res) {
  if (!dbPromise) dbPromise = connectDB();
  await dbPromise;
  return app(req, res);
}
