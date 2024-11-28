const request = require('supertest');
const app = require('../server'); // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/User'); // Import the User model

// Mock environment variables (if needed)
require('dotenv').config({ path: '.env' });

// Connect to a test database
beforeAll(async () => {
    const testDbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager-test';
    await mongoose.connect(testDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up test database after each test
afterEach(async () => {
    await User.deleteMany();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Test: Register a new user
describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
    });

    it('should not allow duplicate email registration', async () => {
        // Register once
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });

        // Try to register again
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg', 'User already exists');
    });
});

// Test: Login a user
describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
        // Register a user first
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });

        // Login with the same credentials
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
    });

    it('should return error for invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrong password',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });
});
