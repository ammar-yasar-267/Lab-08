// server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { users } = require('./data');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration using in-memory users
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username);
  if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Set up routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Exporting app for testing
module.exports = app;
