export type SubscriptionTier = 'Basic' | 'Pro' | 'Enterprise';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  autoRenew: boolean;
  isActive: boolean;
  usedMessages: number;
}
