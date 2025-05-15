const request = require('supertest');
const app = require('../src/app');
const db = require('../database/db');
const User = require('../src/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../src/config/config');

describe('User API Endpoints', () => {
  beforeAll(async () => {
    // Sync the database and create the table if it doesn't exist
    await db.sync({ force: true }); // Use force: true to clear the database for testing

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await db.close();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return an error if username already exists', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'new1@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Username already exists');
    });

      it('should return an error if email already exists', async () => {
          const res = await request(app)
              .post('/api/users/register')
              .send({
                  username: 'newuser2',
                  email: 'test@example.com',
                  password: 'password123',
              });
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('error', 'Email already exists');
      });

      it('should return an error if password is too short', async () => {
          const res = await request(app)
              .post('/api/users/register')
              .send({
                  username: 'newuser3',
                  email: 'new3@example.com',
                  password: 'pass',
              });
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('error');
      });
  });

  describe('POST /api/users/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return an error if the user does not exist', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'nonexistentuser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return an error if the password is incorrect', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword',
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get the user profile', async () => {
      // Login first to get the token
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('email', 'test@example.com');
    });

    it('should return an error if no token is provided', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'No token provided');
    });

    it('should return an error if the token is invalid', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer invalidtoken`);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid token');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update the user profile', async () => {
      // Login first to get the token
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      const token = loginRes.body.token;

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'updated@example.com',
          password: 'newpassword123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Profile updated successfully');

      // Verify the password was updated
      const user = await User.findOne({ where: { username: 'testuser' } });
      const passwordMatch = await bcrypt.compare('newpassword123', user.password);
      expect(passwordMatch).toBe(true);
    });

    it('should return an error if no token is provided', async () => {
      const res = await request(app).put('/api/users/profile').send({ email: 'updated@example.com' });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'No token provided');
    });

    it('should return an error if the token is invalid', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer invalidtoken`)
        .send({
          email: 'updated@example.com',
          password: 'newpassword123',
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid token');
    });

    it('should return an error if trying to update with an existing email', async () => {
      // Create a second user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser2',
        email: 'test2@example.com',
        password: hashedPassword,
      });

      // Login first to get the token
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      const token = loginRes.body.token;

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test2@example.com',
          password: 'newpassword123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });
  });
});