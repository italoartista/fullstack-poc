const request = require('supertest');
const express = require('express');
const productRoutes = require('../src/routes/products');
require('dotenv').config({ path: './.env.test' });

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Products API', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        stock: 100,
      });
    expect(res.statusCode).toEqual(200);
    // expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Product');
  });

  it('should retrieve all products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should retrieve a product by id', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        stock: 50,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Product');
  });

  it('should delete a product', async () => {
    const res = await request(app).delete('/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Product deleted');
  });
});
