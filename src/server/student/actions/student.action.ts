"use server";

import { StudentRepository } from "../repositories/student.repository";
import { StudentDTO, TStudentResponse } from "../dtos/student.dto";
import { TCreateStudentInput, TGetStudentById, TGetStudentsQuery, TUpdateStudentInput } from "../validations/student.validation";
import { BadRequestException, NotFoundException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { prismaActive } from "@/libs/prisma/prisma";
import bcrypt from "bcrypt";
// import { Role } from "@prisma/client";

// export const getDashboardSummaryAction = async () => {
//   await serverCheckPermission([PERMISSIONS.VIEW_STUDENT]);

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const [totalStudents, totalAbsentOrExcused, totalLate] = await Promise.all([
//     prismaActive.student.count(),
//     prismaActive.attendance.count({
//       where: {
//         date: today,
//         status: { in: ["ABSENT", "EXCUSED"] },
//       },
//     }),
//     prismaActive.attendance.count({
//       where: {
//         date: today,
//         status: "LATE",
//       },
//     }),
//   ]);

//   return {
//     totalStudents,
//     totalAbsentOrExcused,
//     totalLate,
//   };
// };
export const getDashboardSummaryAction = async () => {
  const session = await serverCheckPermission([PERMISSIONS.VIEW_STUDENT]);
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  if (session.role === "STUDENT") {
    const user = await prismaActive.user.findUnique({ where: { id: BigInt(session.userId) } });
    const studentId = user?.studentId;

    if (!studentId) return { totalStudents: 0, totalAbsentOrExcused: 0, totalLate: 0 };

    const startOfMonth = new Date(todayUTC.getFullYear(), todayUTC.getMonth(), 1);

    const [myTotalPresent, myTotalAbsent, myTotalLate] = await Promise.all([
      prismaActive.attendance.count({ where: { studentId, date: { gte: startOfMonth }, status: "PRESENT" } }),
      prismaActive.attendance.count({ where: { studentId, date: { gte: startOfMonth }, status: { in: ["ABSENT", "EXCUSED"] } } }),
      prismaActive.attendance.count({ where: { studentId, date: { gte: startOfMonth }, status: "LATE" } }),
    ]);

    return {
      totalStudents: myTotalPresent, // Ubah label di UI Frontend nanti jadi "Kehadiran Bulan Ini"
      totalAbsentOrExcused: myTotalAbsent,
      totalLate: myTotalLate,
    };
  }

  // Jika ADMIN, jalankan kode lama (hitung seluruh sekolah)
  const [totalStudents, totalAbsentOrExcused, totalLate] = await Promise.all([
    prismaActive.student.count(),
    prismaActive.attendance.count({
      where: {
        date: todayUTC, // 👈 Pastikan menggunakan todayUTC
        status: { in: ["ABSENT", "EXCUSED"] },
      },
    }),
    prismaActive.attendance.count({
      where: {
        date: todayUTC, // 👈 Pastikan menggunakan todayUTC
        status: "LATE",
      },
    }),
  ]);

  return { totalStudents, totalAbsentOrExcused, totalLate };
};

export const getStudentsAction = async (query: TGetStudentsQuery) => {
  await serverCheckPermission([PERMISSIONS.VIEW_STUDENT]);

  const { data, meta } = await StudentRepository.findMany(query);

  return {
    data: StudentDTO.toResponseList(data),
    meta,
  };
};

export const getStudentByIdAction = async (input: TGetStudentById): Promise<TStudentResponse> => {
  await serverCheckPermission([PERMISSIONS.VIEW_STUDENT]);

  const student = await StudentRepository.findById(input.id);
  if (!student) throw new NotFoundException("Data siswa tidak ditemukan");

  return StudentDTO.toResponse(student);
};

export const createStudentAction = async (input: TCreateStudentInput): Promise<TStudentResponse> => {
  await serverCheckPermission([PERMISSIONS.CREATE_STUDENT]);

  const existingClass = await prismaActive.class.findUnique({ where: { id: input.classId } });
  if (!existingClass) throw new BadRequestException("Kelas tidak ditemukan");

  const existingNis = await StudentRepository.findByNis(input.nis);
  if (existingNis) throw new BadRequestException("NIS sudah terdaftar");

  const existingEmail = await StudentRepository.findByEmail(input.email);
  if (existingEmail) throw new BadRequestException("Email sudah terdaftar");

  const defaultPassword = await bcrypt.hash(input.nis, 10);

  const result = await prismaActive.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: {
        nis: input.nis,
        name: input.name,
        email: input.email,
        classId: input.classId,
      },
      include: { class: true },
    });

    await tx.user.create({
      data: {
        email: input.email,
        password: defaultPassword,
        name: input.name,
        role: "STUDENT",
        studentId: student.id,
      },
    });

    return student;
  });

  return StudentDTO.toResponse(result);
};

export const updateStudentAction = async (input: TUpdateStudentInput): Promise<TStudentResponse> => {
  await serverCheckPermission([PERMISSIONS.EDIT_STUDENT]);

  const student = await StudentRepository.findById(input.id);
  if (!student) throw new NotFoundException("Data siswa tidak ditemukan");

  if (input.nis && input.nis !== student.nis) {
    const existingNis = await StudentRepository.findByNis(input.nis);
    if (existingNis) throw new BadRequestException("NIS sudah terdaftar oleh siswa lain");
  }

  if (input.email && input.email !== student.email) {
    const existingEmail = await StudentRepository.findByEmail(input.email);
    if (existingEmail) throw new BadRequestException("Email sudah terdaftar oleh siswa lain");
  }

  if (input.classId && input.classId !== student.classId) {
    const existingClass = await prismaActive.class.findUnique({ where: { id: input.classId } });
    if (!existingClass) throw new BadRequestException("Kelas tidak ditemukan");
  }

  const { id, ...updateData } = input;
  const updatedStudent = await StudentRepository.update(id, updateData);

  return StudentDTO.toResponse(updatedStudent);
};

export const deleteStudentAction = async (input: TGetStudentById): Promise<{ success: boolean }> => {
  await serverCheckPermission([PERMISSIONS.DELETE_STUDENT]);

  const student = await StudentRepository.findById(input.id);
  if (!student) throw new NotFoundException("Data siswa tidak ditemukan");

  await StudentRepository.delete(input.id);

  return { success: true };
};
