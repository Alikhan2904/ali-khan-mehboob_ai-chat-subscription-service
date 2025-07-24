import { prisma } from '../../config/db';

export const chatRepo = {
  async createChat(userId: string, question: string, answer: string, tokens: number) {
    return prisma.chat.create({ data: { userId, question, answer, tokens } });
  },
  async getMonthlyChatsByUser(userId: string) {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return prisma.chat.findMany({
      where: {
        userId,
        createdAt: { gte: start },
      },
    });
  },
};
