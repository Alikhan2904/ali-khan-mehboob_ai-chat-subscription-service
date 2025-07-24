import express from 'express';
import { subscriptionRepo } from '../repositories/subscriptionRepo';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Calculate renewalDate if not provided
    let { startDate, billingCycle, tier, price } = req.body;
    if (!startDate) startDate = new Date();
    let renewalDate;
    if (billingCycle === 'monthly') {
      renewalDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1));
    } else if (billingCycle === 'yearly') {
      renewalDate = new Date(
        new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1),
      );
    } else {
      renewalDate = new Date(startDate);
    }
    // Set default price if not provided
    if (price === undefined) {
      if (tier === 'Basic') price = 10;
      else if (tier === 'Pro') price = 50;
      else if (tier === 'Enterprise') price = 200;
      else price = 0;
    }
    const sub = await subscriptionRepo.createSubscription({
      ...req.body,
      startDate,
      renewalDate,
      price,
    });
    res.json(sub);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
