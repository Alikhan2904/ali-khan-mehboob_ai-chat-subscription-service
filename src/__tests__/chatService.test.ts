import { chatService } from '../chat/services/chatService';
import { prisma } from '../config/db';

describe('chatService', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: { id: 'ak-test-1', email: 'ak-test-1@example.com', name: 'Ali Khan Test 1' },
    });
  });
  afterAll(async () => {
    await prisma.chat.deleteMany({ where: { userId: 'ak-test-1' } });
    await prisma.user.delete({ where: { id: 'ak-test-1' } });
    await prisma.$disconnect();
  });

  it('should throw error if user does not exist', async () => {
    await expect(chatService.askQuestion('ak-nonexistent', 'test?')).rejects.toThrow(
      'User does not exist',
    );
  });

  it('should allow a valid user to ask a question (free quota)', async () => {
    const result = await chatService.askQuestion('ak-test-1', 'What is Jest?');
    expect(result).toHaveProperty('question', 'What is Jest?');
    expect(result).toHaveProperty('answer');
  });
});
