"use server";

import { AttendanceRepository } from "../repositories/attendance.repository";
import { AttendanceDTO, TAttendanceResponse } from "../dtos/attendance.dto";
import { TCheckInInput, TCheckOutInput, TGetAttendancesQuery, TMarkAbsenceInput, TUpdateAttendanceInput } from "../validations/attendance.validation";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { prismaActive } from "@/libs/prisma/prisma";
import { AttendanceStatus } from "@prisma/client";

const getStudentIdFromSession = async (userId: string): Promise<bigint> => {
  const user = await prismaActive.user.findUnique({ where: { id: BigInt(userId) } });
  if (!user || !user.studentId) throw new UnauthorizedException();
  return user.studentId;
};

const getTodayDate = () => {
  const today = new Date();
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
};

export const checkInAction = async (input: TCheckInInput): Promise<TAttendanceResponse> => {
  const session = await serverCheckPermission([PERMISSIONS.CHECKIN_ATTENDANCE]);
  const studentId = await getStudentIdFromSession(session.userId);
  const today = getTodayDate();

  const existing = await AttendanceRepository.findByStudentAndDate(studentId, today);
  if (existing) throw new BadRequestException("Anda sudah melakukan check-in hari ini");

  const activeSetting = await prismaActive.attendanceSetting.findFirst({ where: { isActive: true } });
  if (!activeSetting) throw new BadRequestException("Sistem absensi belum dikonfigurasi oleh Admin");

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [setHour, setMinute] = activeSetting.checkInTime.split(":").map(Number);
  const settingMinutes = setHour * 60 + setMinute;

  const status = currentMinutes > settingMinutes + activeSetting.lateThreshold ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

  const attendance = await AttendanceRepository.create({
    studentId,
    date: today,
    checkInTime: now,
    status,
    notes: input.notes,
  });

  return AttendanceDTO.toResponse(attendance);
};

export const checkOutAction = async (input: TCheckOutInput): Promise<TAttendanceResponse> => {
  const session = await serverCheckPermission([PERMISSIONS.CHECKOUT_ATTENDANCE]);
  const studentId = await getStudentIdFromSession(session.userId);
  const today = getTodayDate();

  const attendance = await AttendanceRepository.findByStudentAndDate(studentId, today);
  if (!attendance) throw new BadRequestException("Anda belum melakukan check-in hari ini");
  if (attendance.checkOutTime) throw new BadRequestException("Anda sudah melakukan check-out");

  const updated = await AttendanceRepository.update(attendance.id, {
    checkOutTime: new Date(),
    notes: input.notes ? `${attendance.notes || ""} | Keluar: ${input.notes}` : attendance.notes,
  });

  return AttendanceDTO.toResponse(updated);
};

// export const getAttendancesAction = async (query: TGetAttendancesQuery) => {
//   const session = await serverCheckPermission([PERMISSIONS.VIEW_ATTENDANCE]);

//   if (session.role === "STUDENT") {
//     const user = await prismaActive.user.findUnique({
//       where: { id: BigInt(session.userId) },
//     });

//     if (user?.studentId) {
//       query.studentId = user.studentId;
//     }
//   }

//   const { data, meta } = await AttendanceRepository.findMany(query);
//   return { data: AttendanceDTO.toResponseList(data), meta };
// };
export const getAttendancesAction = async (query: TGetAttendancesQuery) => {
  const session = await serverCheckPermission([PERMISSIONS.VIEW_ATTENDANCE]);

  // LOGIKA ISOLASI
  if (session.role === "STUDENT") {
    const user = await prismaActive.user.findUnique({ where: { id: BigInt(session.userId) } });
    if (user?.studentId) {
      // PAKSA query menggunakan studentId dia sendiri
      query.studentId = user.studentId;
    }
  }

  const { data, meta } = await AttendanceRepository.findMany(query);
  return { data: AttendanceDTO.toResponseList(data), meta };
};

export const markAbsenceAction = async (input: TMarkAbsenceInput): Promise<TAttendanceResponse> => {
  await serverCheckPermission([PERMISSIONS.MANAGE_ATTENDANCE]);

  const targetDate = new Date(input.date);
  const existing = await AttendanceRepository.findByStudentAndDate(input.studentId, targetDate);
  if (existing) throw new BadRequestException("Siswa sudah memiliki catatan absensi pada tanggal tersebut");

  const attendance = await AttendanceRepository.create({
    studentId: input.studentId,
    date: targetDate,
    status: input.status,
    notes: input.notes,
  });

  return AttendanceDTO.toResponse(attendance);
};

export const updateAttendanceAction = async (input: TUpdateAttendanceInput): Promise<TAttendanceResponse> => {
  await serverCheckPermission([PERMISSIONS.MANAGE_ATTENDANCE]);

  const existing = await AttendanceRepository.findById(input.id);
  if (!existing) throw new NotFoundException("Data absensi tidak ditemukan");

  const { id, ...updateData } = input;
  const updated = await AttendanceRepository.update(id, updateData);

  return AttendanceDTO.toResponse(updated);
};
