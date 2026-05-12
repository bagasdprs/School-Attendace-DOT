import { prisma } from "@/libs/prisma/prisma";
import { Prisma } from "@prisma/client";
import { TGetStudentsQuery } from "../validations/student.validation";
import { TStudentEntity } from "@/server/student/dtos/student.dto";

export const StudentRepository = {
  async findMany(query: TGetStudentsQuery) {
    const { page, perPage, search, classId, sortBy, sortOrder } = query;

    const where: Prisma.StudentWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search } }, { nis: { contains: search } }],
      }),
      ...(classId && { classId }),
    };

    const [data, meta] = await prisma.student
      .paginate({
        where,
        include: { class: true },
        orderBy: {
          [sortBy || "createdAt"]: sortOrder,
        },
      })
      .withPages({ limit: perPage, page });

    return { data: data as TStudentEntity[], meta };
  },

  async findById(id: bigint): Promise<TStudentEntity | null> {
    return await prisma.student.findUnique({
      where: { id },
      include: { class: true },
    });
  },

  async findByNis(nis: string): Promise<TStudentEntity | null> {
    return await prisma.student.findUnique({
      where: { nis },
    });
  },

  async findByEmail(email: string): Promise<TStudentEntity | null> {
    return await prisma.student.findUnique({
      where: { email },
    });
  },

  async create(data: Prisma.StudentUncheckedCreateInput): Promise<TStudentEntity> {
    return await prisma.student.create({
      data,
      include: { class: true },
    });
  },

  async update(id: bigint, data: Prisma.StudentUncheckedUpdateInput): Promise<TStudentEntity> {
    return await prisma.student.update({
      where: { id },
      data,
      include: { class: true },
    });
  },

  async delete(id: bigint): Promise<void> {
    await prisma.student.delete({
      where: { id },
    });
  },
};
