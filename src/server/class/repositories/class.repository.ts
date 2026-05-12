import { prisma } from "@/libs/prisma/prisma";
import { Prisma, Class } from "@prisma/client";
import { TGetClassesQuery } from "../validations/class.validation";

export const ClassRepository = {
  async findMany(query: TGetClassesQuery) {
    const { page, perPage, search, sortBy, sortOrder } = query;

    const where: Prisma.ClassWhereInput = {
      ...(search && {
        name: { contains: search },
      }),
    };

    const [data, meta] = await prisma.class
      .paginate({
        where,
        orderBy: {
          [sortBy || "createdAt"]: sortOrder,
        },
      })
      .withPages({ limit: perPage, page });

    return { data: data as Class[], meta };
  },

  async findById(id: bigint): Promise<Class | null> {
    return await prisma.class.findUnique({ where: { id } });
  },

  async findByName(name: string): Promise<Class | null> {
    return await prisma.class.findUnique({ where: { name } });
  },

  async create(data: Prisma.ClassCreateInput): Promise<Class> {
    return await prisma.class.create({ data });
  },

  async update(id: bigint, data: Prisma.ClassUpdateInput): Promise<Class> {
    return await prisma.class.update({
      where: { id },
      data,
    });
  },

  async delete(id: bigint): Promise<void> {
    await prisma.class.delete({ where: { id } });
  },
};
