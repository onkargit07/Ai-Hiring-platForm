import request from 'supertest';
import app from '../server';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'Test@123',
          role: 'CANDIDATE',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Test@123',
          role: 'CANDIDATE',
        });

      expect(response.status).toBe(400);
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123',
          role: 'CANDIDATE',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      const email = `test${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email,
          password: 'Test@123',
          role: 'CANDIDATE',
        });

      // Then try to login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email,
          password: 'Test@123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });
});
