// routes/events.js
const express = require('express');
const { events, getNextEventId } = require('../data');

const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// Create a new event
router.post('/', isAuthenticated, (req, res) => {
  const { name, description, date, time, category, reminder } = req.body;
  const newEvent = {
    id: getNextEventId(),
    user: req.user.id,
    name,
    description,
    date: new Date(date), // stored as Date object
    time,
    category: category || 'Other',
    reminder: reminder || false,
  };
  events.push(newEvent);
  res.status(201).json({ message: 'Event created', event: newEvent });
});

// View upcoming events with optional sorting
router.get('/', isAuthenticated, (req, res) => {
  const { sortBy } = req.query;
  // Filter events for the authenticated user that are upcoming
  let userEvents = events.filter(event => event.user === req.user.id && event.date >= new Date());
  
  if (sortBy === 'date') {
    userEvents.sort((a, b) => a.date - b.date);
  } else if (sortBy === 'category') {
    userEvents.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'reminder') {
    // Sort so that events with reminders (true) appear first
    userEvents.sort((a, b) => (b.reminder === true) - (a.reminder === true));
  }
  
  res.json({ events: userEvents });
});

module.exports = router;
