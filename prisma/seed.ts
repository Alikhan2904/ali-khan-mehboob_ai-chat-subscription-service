import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findMany({ where: { id: "user-1" } });

  if (existingUser.length > 0) {
    console.log("User already exists, skipping creation");
    return;
  }

  const user = await prisma.user.create({
    data: {
      id: "user-1",
      email: "user1@example.com",
      name: "User One",
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user.id,
      tier: "Basic",
      billingCycle: "monthly",
      price: 10.0,
      startDate: new Date("2025-07-01T00:00:00Z"),
      endDate: new Date("2025-08-01T00:00:00Z"),
      renewalDate: new Date("2025-08-01T00:00:00Z"),
      autoRenew: true,
      isActive: true,
      usedMessages: 0,
    },
  });

  console.log("Seeded user and subscription for user-1");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
