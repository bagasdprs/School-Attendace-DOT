import { prisma } from "@/libs/prisma/prisma";
import { Prisma } from "@prisma/client";
import { TGetAttendancesQuery } from "../validations/attendance.validation";
import { TAttendanceEntity } from "../dtos/attendance.dto";

export const AttendanceRepository = {
  async findMany(query: TGetAttendancesQuery) {
    const { page, perPage, studentId, classId, date, status, sortBy, sortOrder } = query;

    const where: Prisma.AttendanceWhereInput = {
      ...(studentId && { studentId }),
      ...(classId && { student: { classId } }),
      ...(date && { date: new Date(date) }),
      ...(status && { status }),
    };

    const [data, meta] = await prisma.attendance
      .paginate({
        where,
        include: {
          student: { include: { class: true } },
        },
        orderBy: { [sortBy || "createdAt"]: sortOrder },
      })
      .withPages({ limit: perPage, page });

    return { data: data as TAttendanceEntity[], meta };
  },

  // Penting untuk mengecek apakah siswa sudah check-in hari ini
  async findByStudentAndDate(studentId: bigint, date: Date): Promise<TAttendanceEntity | null> {
    return await prisma.attendance.findFirst({
      where: {
        studentId: studentId,
        date: date,
      },
      include: { student: { include: { class: true } } },
    });
  },

  async findById(id: bigint): Promise<TAttendanceEntity | null> {
    return await prisma.attendance.findUnique({
      where: { id },
      include: { student: { include: { class: true } } },
    });
  },

  async create(data: Prisma.AttendanceUncheckedCreateInput): Promise<TAttendanceEntity> {
    return await prisma.attendance.create({
      data,
      include: { student: { include: { class: true } } },
    });
  },

  async update(id: bigint, data: Prisma.AttendanceUncheckedUpdateInput): Promise<TAttendanceEntity> {
    return await prisma.attendance.update({
      where: { id },
      data,
      include: { student: { include: { class: true } } },
    });
  },
};
