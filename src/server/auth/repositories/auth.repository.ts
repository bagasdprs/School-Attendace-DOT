import { prismaActive } from "@/libs/prisma/prisma";
import { Prisma, User } from "@prisma/client";

export const AuthRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return await prismaActive.user.findUnique({
      where: {
        email,
      },
    });
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prismaActive.user.create({
      data,
    });
  },

  async findById(id: bigint): Promise<User | null> {
    return await prismaActive.user.findUnique({
      where: {
        id,
      },
    });
  },

  async update(id: bigint, data: Prisma.UserUpdateInput): Promise<User> {
    return await prismaActive.user.update({
      where: { id },
      data,
    });
  },
};
