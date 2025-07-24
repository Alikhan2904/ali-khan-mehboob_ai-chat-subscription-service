import { chatRepo } from "../repositories/chatRepo";
import { subscriptionService } from "../../subscriptions/services/subscriptionService";
import { AppError } from "../../shared/errors";

export const chatService = {
  async askQuestion(userId: string, question: string) {
    // Check if user exists
    const { prisma } = await import("../../config/db");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("User does not exist", 404);
    }

    const monthlyChats = await chatRepo.getMonthlyChatsByUser(userId);
    const freeQuotaLeft = 3 - monthlyChats.length;
    if (freeQuotaLeft > 0) {
      // Use free quota
    } else {
      // Throws if no bundle with quota
      await subscriptionService.useBundle(userId);
    }

    await new Promise((res) => setTimeout(res, 1000));

    const answer =
      "Hi there! I am an AI created by Ali Khan Mehboob. How can I assist you today?";
    const tokens = 10;
    return chatRepo.createChat(userId, question, answer, tokens);
  },
};
