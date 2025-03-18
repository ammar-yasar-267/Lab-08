// routes/auth.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { users, getNextUserId } = require('../data');

const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Check if the user already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: getNextUserId(),
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login using Passport
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
