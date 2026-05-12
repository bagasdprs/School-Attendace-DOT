"use server";

import { ClassRepository } from "../repositories/class.repository";
import { ClassDTO, TClassResponse } from "../dtos/class.dto";
import { TCreateClassInput, TGetClassById, TGetClassesQuery, TUpdateClassInput } from "../validations/class.validation";
import { BadRequestException, NotFoundException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { prismaActive } from "@/libs/prisma/prisma";

export const getClassesAction = async (query: TGetClassesQuery) => {
  await serverCheckPermission([PERMISSIONS.VIEW_CLASS]);

  const { data, meta } = await ClassRepository.findMany(query);

  return {
    data: ClassDTO.toResponseList(data),
    meta,
  };
};

export const getClassByIdAction = async (input: TGetClassById): Promise<TClassResponse> => {
  await serverCheckPermission([PERMISSIONS.VIEW_CLASS]);

  const classData = await ClassRepository.findById(input.id);
  if (!classData) throw new NotFoundException("Data kelas tidak ditemukan");

  return ClassDTO.toResponse(classData);
};

export const createClassAction = async (input: TCreateClassInput): Promise<TClassResponse> => {
  await serverCheckPermission([PERMISSIONS.CREATE_CLASS]);

  const existingName = await ClassRepository.findByName(input.name);
  if (existingName) throw new BadRequestException("Nama kelas sudah digunakan");

  const newClass = await ClassRepository.create(input);
  return ClassDTO.toResponse(newClass);
};

export const updateClassAction = async (input: TUpdateClassInput): Promise<TClassResponse> => {
  await serverCheckPermission([PERMISSIONS.EDIT_CLASS]);

  const classData = await ClassRepository.findById(input.id);
  if (!classData) throw new NotFoundException("Data kelas tidak ditemukan");

  if (input.name && input.name !== classData.name) {
    const existingName = await ClassRepository.findByName(input.name);
    if (existingName) throw new BadRequestException("Nama kelas sudah digunakan");
  }

  const { id, ...updateData } = input;
  const updatedClass = await ClassRepository.update(id, updateData);

  return ClassDTO.toResponse(updatedClass);
};

export const deleteClassAction = async (input: TGetClassById): Promise<{ success: boolean }> => {
  await serverCheckPermission([PERMISSIONS.DELETE_CLASS]);

  const classData = await ClassRepository.findById(input.id);
  if (!classData) throw new NotFoundException("Data kelas tidak ditemukan");

  const studentCount = await prismaActive.student.count({
    where: { classId: input.id },
  });

  if (studentCount > 0) {
    throw new BadRequestException("Gagal menghapus: Kelas ini masih memiliki data siswa aktif di dalamnya");
  }

  await ClassRepository.delete(input.id);

  return { success: true };
};
