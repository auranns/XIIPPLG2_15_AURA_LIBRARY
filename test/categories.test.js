// File: tests/categories.test.js
const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

beforeAll(async () => {
  // Create categories table if not exists
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

afterAll(async () => {
  // Clean up: drop test data
  await db.query('DELETE FROM categories');
  await db.end();
});

describe('Categories API', () => {
  let categoryId;

  test('POST /api/categories - Create category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({
        name: 'Test Category',
        description: 'Test Description'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    categoryId = res.body.id;
  });

  test('GET /api/categories - Get all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('GET /api/categories/:id - Get category by ID', async () => {
    const res = await request(app).get(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test Category');
  });

  test('PUT /api/categories/:id - Update category', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .send({
        name: 'Updated Category',
        description: 'Updated Description'
      });
    
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/categories/:id - Delete category', async () => {
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
  });
});