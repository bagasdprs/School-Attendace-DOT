"use server";

import { RecapRepository } from "../repositories/recap.repository";
import { TClassRecapResponse, TRecapSummary, TStudentRecapResponse } from "../dtos/recap.dto";
import { TGetClassRecapInput, TGetStudentRecapInput } from "../validations/recap.validation";
import { NotFoundException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { AttendanceStatus } from "@prisma/client";

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
  await serverCheckPermission([PERMISSIONS.VIEW_RECAP]); // [cite: 142]

  const student = await RecapRepository.getStudentInfo(input.studentId);
  if (!student) throw new NotFoundException("Data siswa tidak ditemukan");

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  const attendances = await RecapRepository.getStudentAttendances(input.studentId, start, end, input.status);
  const summary = calculateSummary(attendances);

  return {
    studentId: student.id.toString(),
    studentName: student.name,
    nis: student.nis,
    ...summary,
  };
};

export const getClassRecapAction = async (input: TGetClassRecapInput): Promise<TClassRecapResponse> => {
  await serverCheckPermission([PERMISSIONS.VIEW_RECAP]); // [cite: 142]

  const classData = await RecapRepository.getClassInfo(input.classId);
  if (!classData) throw new NotFoundException("Data kelas tidak ditemukan");

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  const studentsWithAttendances = await RecapRepository.getClassWithAttendances(input.classId, start, end, input.status);

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
  await serverCheckPermission([PERMISSIONS.EXPORT_RECAP]); // [cite: 142]

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
