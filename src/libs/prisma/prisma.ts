import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";
import { createSoftDeleteExtension } from "prisma-extension-soft-delete";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const basePrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

const softDeleteExtension = createSoftDeleteExtension({
  models: {
    Student: true,
    Class: true,
    AttendanceSetting: true,
    Attendance: true,
    User: true,
  },
  defaultConfig: {
    field: "deletedAt",
    createValue: (deleted) => {
      if (deleted) return new Date();
      return null;
    },
  },
});

export const prismaActive = basePrisma.$extends(softDeleteExtension);
export const prismaWithTrashed = basePrisma.$extends(pagination());
export const prisma = prismaActive.$extends(pagination());
export default prisma;
