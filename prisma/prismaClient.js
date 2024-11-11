import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export { prisma };
