// data.js
let userIdCounter = 1;
let eventIdCounter = 1;

const users = [];
const events = [];

function getNextUserId() {
  return userIdCounter++;
}

function getNextEventId() {
  return eventIdCounter++;
}

module.exports = { users, events, getNextUserId, getNextEventId };
