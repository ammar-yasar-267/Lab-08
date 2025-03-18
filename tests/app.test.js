// tests/app.test.js
const request = require('supertest');
const app = require('../server');
const { users, events } = require('../data');

describe('Auth API', () => {
  // Clear users and events arrays after each test
  afterEach(() => {
    users.length = 0;
    events.length = 0;
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered successfully');
  });
});
