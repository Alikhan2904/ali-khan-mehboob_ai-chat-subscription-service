import request from 'supertest';
import express from 'express';
import subscriptionRouter from '../subscriptions/controllers/subscriptionController';
import { prisma } from '../config/db';

describe('subscriptionController', () => {
  const app = express();
  app.use(express.json());
  app.use('/subscriptions', subscriptionRouter);

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: 'ali-khan',
        email: 'ali.khan@example.com',
        name: 'Ali Khan',
      },
    });
  });
  afterAll(async () => {
    await prisma.subscription.deleteMany({ where: { userId: 'ali-khan' } });
    await prisma.user.delete({ where: { id: 'ali-khan' } });
    await prisma.$disconnect();
  });

  it('should create a subscription for an existing user', async () => {
    const res = await request(app).post('/subscriptions').send({
      userId: 'ali-khan',
      tier: 'Basic',
      billingCycle: 'monthly',
      startDate: '2025-07-01T00:00:00Z',
      endDate: '2025-08-01T00:00:00Z',
      autoRenew: false,
      isActive: false,
      usedMessages: 0,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId', 'ali-khan');
    expect(res.body).toHaveProperty('tier', 'Basic');
  });

  it('should return error for non-existent user', async () => {
    const res = await request(app)
      .post('/subscriptions')
      .send({ userId: 'nonexistent', tier: 'Basic', billingCycle: 'monthly' });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/User does not exist/);
  });
});
