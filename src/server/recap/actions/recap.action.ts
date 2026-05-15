"use server";

import { RecapRepository } from "../repositories/recap.repository";
import { TClassRecapResponse, TRecapSummary, TStudentRecapResponse } from "../dtos/recap.dto";
import { TGetClassRecapInput, TGetStudentRecapInput } from "../validations/recap.validation";
import { NotFoundException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { AttendanceStatus } from "@prisma/client";
import { prismaActive } from "@/libs/prisma/prisma";

const calculateSummary = (attendances: { status: AttendanceStatus }[]): TRecapSummary => {
  let present = 0;
  let late = 0;
  let absent = 0;
  let excused = 0;

  attendances.forEach((att) => {
    if (att.status === AttendanceStatus.PRESENT) present++;
    if (att.status === AttendanceStatus.LATE) late++;
    if (att.status === AttendanceStatus.ABSENT) absent++;
    if (att.status === AttendanceStatus.EXCUSED) excused++;
  });

  const totalDays = attendances.length;
  const attendingDays = present + late;
  const percentage = totalDays > 0 ? (attendingDays / totalDays) * 100 : 0;

  return {
    present,
    late,
    absent,
    excused,
    totalDays,
    attendancePercentage: percentage.toFixed(2) + "%",
  };
};

export const getStudentRecapAction = async (input: TGetStudentRecapInput): Promise<TStudentRecapResponse> => {
  const session = await serverCheckPermission([PERMISSIONS.VIEW_RECAP]);

  let targetStudentId = input.studentId;

  if (session.role === "STUDENT") {
    const user = await prismaActive.user.findUnique({ where: { id: BigInt(session.userId) } });
    if (user?.studentId) {
      targetStudentId = user.studentId;
    }
  }

  const student = await RecapRepository.getStudentInfo(targetStudentId);
  if (!student) throw new NotFoundException("Data siswa tidak ditemukan");

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  const attendances = await RecapRepository.getStudentAttendances(targetStudentId, start, end, input.status);
  const summary = calculateSummary(attendances);

  return {
    studentId: student.id.toString(),
    studentName: student.name,
    nis: student.nis,
    ...summary,
  };
};

export const getClassRecapAction = async (input: TGetClassRecapInput): Promise<TClassRecapResponse> => {
  const session = await serverCheckPermission([PERMISSIONS.VIEW_RECAP]);

  let targetClassId = input.classId;
  let studentsWithAttendances: any[] = [];
  let classData = { id: BigInt(0), name: "Semua Kelas" };

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  if (session.role === "STUDENT") {
    const user = await prismaActive.user.findUnique({
      where: { id: BigInt(session.userId) },
      include: { student: { include: { class: true } } },
    });

    if (user?.studentId && user?.student?.classId) {
      targetClassId = user.student.classId;
      classData = { id: targetClassId, name: user.student.class?.name || "Kelas" };

      const rawData = await RecapRepository.getClassWithAttendances(targetClassId, start, end, input.status);
      studentsWithAttendances = rawData.filter((student) => student.id === user.studentId);
    }
  } else {
    if (targetClassId) {
      const dbClass = await RecapRepository.getClassInfo(targetClassId);
      if (!dbClass) throw new NotFoundException("Data kelas tidak ditemukan");
      classData = dbClass;
    }

    studentsWithAttendances = await RecapRepository.getClassWithAttendances(targetClassId ?? BigInt(0), start, end, input.status);
  }

  if (input.search) {
    const keyword = input.search.toLowerCase();
    studentsWithAttendances = studentsWithAttendances.filter((student) => student.name.toLowerCase().includes(keyword));
  }

  let classTotalAttendances: { status: AttendanceStatus }[] = [];
  const studentsSummary: TStudentRecapResponse[] = studentsWithAttendances.map((student) => {
    classTotalAttendances = classTotalAttendances.concat(student.attendances);
    return {
      studentId: student.id.toString(),
      studentName: student.name,
      nis: student.nis,
      ...calculateSummary(student.attendances),
    };
  });

  return {
    classId: classData.id.toString(),
    className: classData.name,
    period: `${input.startDate} - ${input.endDate}`,
    classSummary: calculateSummary(classTotalAttendances),
    students: studentsSummary,
  };
};

export const exportClassRecapAction = async (input: TGetClassRecapInput): Promise<string> => {
  await serverCheckPermission([PERMISSIONS.EXPORT_RECAP]);

  const data = await getClassRecapAction(input);

  let csv = `Laporan Kehadiran Kelas ${data.className}\n`;
  csv += `Periode,${data.period}\n\n`;
  csv += `NIS,Nama Siswa,Hadir,Terlambat,Izin,Alpa,Persentase\n`;

  data.students.forEach((student) => {
    csv += `="${student.nis}",${student.studentName},${student.present},${student.late},${student.excused},${student.absent},${student.attendancePercentage}\n`;
  });

  csv += `\nTOTAL KELAS,,${data.classSummary.present},${data.classSummary.late},${data.classSummary.excused},${data.classSummary.absent},${data.classSummary.attendancePercentage}\n`;

  return csv;
};
