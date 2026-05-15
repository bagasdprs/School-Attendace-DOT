import { prismaActive } from "@/libs/prisma/prisma";
import { AttendanceStatus } from "@prisma/client";

export const RecapRepository = {
  async getStudentAttendances(studentId: bigint, startDate: Date, endDate: Date, status?: AttendanceStatus) {
    return await prismaActive.attendance.findMany({
      where: {
        studentId,
        date: { gte: startDate, lte: endDate },
        ...(status && { status }),
      },
    });
  },

  async getClassWithAttendances(classId: bigint | undefined, startDate: Date, endDate: Date, status?: AttendanceStatus) {
    return await prismaActive.student.findMany({
      where: {
        ...(classId && { classId }),
      },
      include: {
        class: true,
        attendances: {
          where: {
            date: { gte: startDate, lte: endDate },
            ...(status && { status }),
          },
        },
      },
    });
  },

  async getStudentInfo(studentId: bigint) {
    return await prismaActive.student.findUnique({ where: { id: studentId } });
  },

  async getClassInfo(classId: bigint) {
    return await prismaActive.class.findUnique({ where: { id: classId } });
  },
};
