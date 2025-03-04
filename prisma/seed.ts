import * as bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("password", 10);

  await prisma.user.upsert({
    where: { email: "demo@prospectory.ai" },
    update: {},
    create: {
      email: "demo@prospectory.ai",
      password: hash,
    },
  });
}

main()
  .then(async () => {
    console.log("Ran seed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
