import { subscriptionService } from '../subscriptions/services/subscriptionService';
import { prisma } from '../config/db';

describe('subscriptionService', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: { id: 'ak-test-sub', email: 'ak-test-sub@example.com', name: 'Ali Khan Test Sub' },
    });
    await prisma.subscription.create({
      data: {
        userId: 'ak-test-sub',
        tier: 'Basic',
        billingCycle: 'monthly',
        price: 10.0,
        startDate: new Date('2025-07-01T00:00:00Z'),
        endDate: new Date('2025-08-01T00:00:00Z'),
        renewalDate: new Date('2025-08-01T00:00:00Z'),
        autoRenew: true,
        isActive: true,
        usedMessages: 0,
      },
    });
  });
  afterAll(async () => {
    await prisma.subscription.deleteMany({ where: { userId: 'ak-test-sub' } });
    await prisma.user.delete({ where: { id: 'ak-test-sub' } });
    await prisma.$disconnect();
  });

  it('should allow usage within quota', async () => {
    await expect(subscriptionService.useBundle('ak-test-sub')).resolves.toBeUndefined();
  });

  it('should throw error if quota exceeded', async () => {
    // Set usedMessages to 10 (limit for Basic)
    await prisma.subscription.updateMany({
      where: { userId: 'ak-test-sub' },
      data: { usedMessages: 10 },
    });
    await expect(subscriptionService.useBundle('ak-test-sub')).rejects.toThrow(
      'All subscription bundles exhausted',
    );
  });
});
