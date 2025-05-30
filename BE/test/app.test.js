const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the express app

describe('App Endpoints', () => {
  it('should get 200 on /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });

  // Add more tests as needed
});