const request = require('supertest');
const app = require('../server');
const db = require('../config/database').db; // Import the database instance
const bcrypt = require('bcrypt');

describe('User Endpoints', () => {
    let userId; // Store the user ID for later use

    beforeAll((done) => {
        // Before all tests, clear the users table and create a test user
        db.run("DELETE FROM users", (err) => {
            if (err) {
                console.error("Error clearing users table:", err);
                done(err);
                return;
            }

            bcrypt.hash('testpassword', 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Error hashing password:", err);
                    done(err);
                    return;
                }

                db.run(
                    "INSERT INTO users (username, password) VALUES (?, ?)",
                    ['testuser', hashedPassword],
                    function (err) {
                        if (err) {
                            console.error("Error inserting test user:", err);
                            done(err);
                            return;
                        }
                        userId = this.lastID;
                        done();
                    }
                );
            });
        });
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({ username: 'newuser', password: 'newpassword' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'testuser', password: 'testpassword' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should get user information by ID', async () => {
        // First, log in to get a token
        const loginRes = await request(app)
            .post('/users/login')
            .send({ username: 'testuser', password: 'testpassword' });

        const token = loginRes.body.token;

        // Then, use the token to get user information
        const res = await request(app)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`); // Set the Authorization header
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('username', 'testuser');
    });

    afterAll((done) => {
        // After all tests, close the database connection
        db.close((err) => {
            if (err) {
                console.error("Error closing database:", err);
            }
            done();
        });
    });
});