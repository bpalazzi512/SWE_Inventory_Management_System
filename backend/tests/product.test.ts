import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app'; 

// Setup- connect to db
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://admin:password123@127.0.0.1:27017/restocked?authSource=admin';
  await mongoose.connect(mongoUri);
});

// Close after test finishes
afterAll(async () => {
  await mongoose.connection.collection('products').deleteMany({ name: 'TEST_AUTOMATION_PRODUCT' });
  await mongoose.disconnect();
});

// Test suite for Product API
describe('Product API Integration Tests', () => {
  let validCategoryId: string;
  let createdProductId: string;
  
  // READ- Verify we can fetch products and data is structured correctly.
  it('GET /api/products- should return list and provide a valid category', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    
    if (res.body.length > 0) {
      const cat = res.body[0].categoryId;
      validCategoryId = (typeof cat === 'object' && cat !== null) ? cat._id : cat;
      console.log('Using real Category ID:', validCategoryId);
    } else {
      validCategoryId = '654321654321'; 
      console.warn('No products found! Using fake Category ID:', validCategoryId);
    }
  });

  // CREATE- Verify we can add a new item to inventory.
  it('POST /api/products- should create a new product', async () => {
    const newProduct = {
      name: 'TEST_AUTOMATION_PRODUCT',
      categoryId: validCategoryId, 
      location: 'Seattle', 
      price: 50
    };

    const res = await request(app).post('/api/products').send(newProduct);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('TEST_AUTOMATION_PRODUCT');
    
    createdProductId = res.body._id; 
  }, 15000); 

  // UPDATE- Verify 'Edit Product' feature.
  it('PUT /api/products/:id- should update the price', async () => {
    if (!createdProductId) {
        throw new Error("Cannot update: Product ID is missing");
    }

    const updatePayload = {
      price: 99.99
    };

    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .send(updatePayload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.price).toEqual(99.99); 
  });
});