import { prisma } from "../../config/db";
import { AppError } from "../../shared/errors";

export const subscriptionRepo = {
  async getAllActiveSubscriptions() {
    return prisma.subscription.findMany({
      where: { isActive: true },
      select: {
        id: true,
        userId: true,
        tier: true,
        billingCycle: true,
        price: true,
        startDate: true,
        endDate: true,
        renewalDate: true,
        autoRenew: true,
        isActive: true,
        usedMessages: true,
      },
    });
  },

  async markInactive(subscriptionId: string) {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { isActive: false },
    });
  },

  async renewSubscription(
    subscriptionId: string,
    newStart: Date,
    newEnd: Date,
    newRenewal: Date
  ) {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        startDate: newStart,
        endDate: newEnd,
        renewalDate: newRenewal,
        usedMessages: 0,
      },
    });
  },

  async cancelSubscription(subscriptionId: string) {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { autoRenew: false },
    });
  },
  async getUserBundles(userId: string) {
    return prisma.subscription.findMany({
      where: { userId, isActive: true },
      orderBy: { endDate: "asc" },
      select: {
        id: true,
        userId: true,
        tier: true,
        billingCycle: true,
        price: true,
        startDate: true,
        endDate: true,
        renewalDate: true,
        autoRenew: true,
        isActive: true,
        usedMessages: true,
      },
    });
  },

  async consumeMessage(subscriptionId: string) {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { usedMessages: { increment: 1 } },
    });
  },

  async createSubscription(data: any) {
    // Ensure price and renewalDate are set
    if (!data.price) throw new Error("Price is required");
    if (!data.renewalDate) throw new Error("Renewal date is required");

    // Check user existence
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user)
      throw new AppError("User does not exist for subscription creation", 404);

    return prisma.subscription.create({ data });
  },
};
