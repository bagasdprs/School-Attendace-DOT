import { prisma } from "@/libs/prisma/prisma";
import { Prisma, AttendanceSetting } from "@prisma/client";
import { TGetSettingsQuery } from "../validations/attendance-setting.validation";

export const AttendanceSettingRepository = {
  async findMany(query: TGetSettingsQuery) {
    const { page, perPage, search, sortBy, sortOrder } = query;

    const where: Prisma.AttendanceSettingWhereInput = {
      ...(search && { name: { contains: search } }),
    };

    const [data, meta] = await prisma.attendanceSetting
      .paginate({
        where,
        orderBy: { [sortBy || "createdAt"]: sortOrder },
      })
      .withPages({ limit: perPage, page });

    return { data: data as AttendanceSetting[], meta };
  },

  async findById(id: bigint): Promise<AttendanceSetting | null> {
    return await prisma.attendanceSetting.findUnique({ where: { id } });
  },

  async findActive(): Promise<AttendanceSetting | null> {
    return await prisma.attendanceSetting.findFirst({
      where: { isActive: true },
    });
  },

  async deactivateAll(): Promise<void> {
    await prisma.attendanceSetting.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  },

  async create(data: Prisma.AttendanceSettingCreateInput): Promise<AttendanceSetting> {
    return await prisma.attendanceSetting.create({ data });
  },

  async update(id: bigint, data: Prisma.AttendanceSettingUpdateInput): Promise<AttendanceSetting> {
    return await prisma.attendanceSetting.update({
      where: { id },
      data,
    });
  },

  async delete(id: bigint): Promise<void> {
    await prisma.attendanceSetting.delete({ where: { id } });
  },
};
