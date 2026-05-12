"use server";

import { StudentRepository } from "../repositories/student.repository";
import { StudentDTO, TStudentResponse } from "../dtos/student.dto";
import { TCreateStudentInput, TGetStudentById, TGetStudentsQuery, TUpdateStudentInput } from "../validations/student.validation";
import { BadRequestException, NotFoundException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { prismaActive } from "@/libs/prisma/prisma";

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

  const newStudent = await StudentRepository.create(input);

  return StudentDTO.toResponse(newStudent);
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
