import { subscriptionRepo } from "../repositories/subscriptionRepo";
import { SubscriptionTier } from "../domain/subscription";

export const subscriptionService = {
  // Simulate auto-renewal and payment failure
  async autoRenewSubscriptions() {
    const activeSubs = await subscriptionRepo.getAllActiveSubscriptions();
    for (const sub of activeSubs) {
      if (sub.autoRenew && new Date(sub.renewalDate) <= new Date()) {
        // Simulate payment failure randomly
        const paymentFailed = Math.random() < 0.2; // 20% fail
        if (paymentFailed) {
          await subscriptionRepo.markInactive(sub.id);
        } else {
          // Renew: set new start/end/renewal dates, reset usage
          const newStart = new Date(sub.renewalDate);
          let newEnd, newRenewal;
          if (sub.billingCycle === "monthly") {
            newEnd = new Date(newStart.setMonth(newStart.getMonth() + 1));
            newRenewal = new Date(newEnd);
          } else {
            newEnd = new Date(newStart.setFullYear(newStart.getFullYear() + 1));
            newRenewal = new Date(newEnd);
          }
          await subscriptionRepo.renewSubscription(
            sub.id,
            newStart,
            newEnd,
            newRenewal
          );
        }
      }
    }
  },

  async cancelSubscription(subscriptionId: string) {
    await subscriptionRepo.cancelSubscription(subscriptionId);
  },
  async useBundle(userId: string): Promise<void> {
    const bundles = await subscriptionRepo.getUserBundles(userId);
    for (const bundle of bundles) {
      const limits = { Basic: 10, Pro: 100, Enterprise: Infinity };
      const max = limits[bundle.tier as SubscriptionTier];
      if (bundle.usedMessages >= max) {
        continue;
      }
      await subscriptionRepo.consumeMessage(bundle.id);
      return;
    }
    const error: any = new Error("All subscription bundles exhausted");
    error.statusCode = 403;
    error.code = "SUBSCRIPTION_QUOTA_EXCEEDED";
    throw error;
  },
};
