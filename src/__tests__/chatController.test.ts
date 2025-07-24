import request from 'supertest';
import express from 'express';
import chatRouter from '../chat/controllers/chatController';
import { prisma } from '../config/db';

describe('chatController', () => {
  const app = express();
  app.use(express.json());
  app.use('/chat', chatRouter);

  beforeAll(async () => {
    await prisma.user.create({
      data: { id: 'ak-test', email: 'ak-test@example.com', name: 'Ali Khan Test Ctrl' },
    });
  });
  afterAll(async () => {
    await prisma.chat.deleteMany({ where: { userId: 'ak-test' } });
    await prisma.user.delete({ where: { id: 'ak-test' } });
    await prisma.$disconnect();
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ userId: 'ak-nonexistent', question: 'test?' });
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/User does not exist/);
  });

  it('should return 200 and answer for valid user', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ userId: 'ak-test', question: 'What is Jest controller?' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('question', 'What is Jest controller?');
    expect(res.body).toHaveProperty('answer');
  });
});
