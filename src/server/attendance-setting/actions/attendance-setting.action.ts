"use server";

import { AttendanceSettingRepository } from "../repositories/attendance-setting.repository";
import { AttendanceSettingDTO, TAttendanceSettingResponse } from "../dtos/attendance-setting.dto";
import { TCreateSettingInput, TGetSettingById, TGetSettingsQuery, TUpdateSettingInput } from "../validations/attendance-setting.validation";
import { NotFoundException, BadRequestException } from "@/errors/base.exception";
import { serverCheckPermission } from "@/common/utils/server-check-permission";
import { PERMISSIONS } from "@/common/enum/permission.enum";

export const getSettingsAction = async (query: TGetSettingsQuery) => {
  await serverCheckPermission([PERMISSIONS.VIEW_ATTENDANCE_SETTING]);

  const { data, meta } = await AttendanceSettingRepository.findMany(query);
  return {
    data: AttendanceSettingDTO.toResponseList(data),
    meta,
  };
};

export const getActiveSettingAction = async (): Promise<TAttendanceSettingResponse> => {
  await serverCheckPermission([PERMISSIONS.VIEW_ATTENDANCE_SETTING]);

  const activeSetting = await AttendanceSettingRepository.findActive();
  if (!activeSetting) throw new NotFoundException("Belum ada pengaturan absensi yang aktif");

  return AttendanceSettingDTO.toResponse(activeSetting);
};

export const createSettingAction = async (input: TCreateSettingInput): Promise<TAttendanceSettingResponse> => {
  await serverCheckPermission([PERMISSIONS.MANAGE_ATTENDANCE_SETTING]);

  if (input.isActive) {
    await AttendanceSettingRepository.deactivateAll();
  }

  const newSetting = await AttendanceSettingRepository.create(input);
  return AttendanceSettingDTO.toResponse(newSetting);
};

export const updateSettingAction = async (input: TUpdateSettingInput): Promise<TAttendanceSettingResponse> => {
  await serverCheckPermission([PERMISSIONS.MANAGE_ATTENDANCE_SETTING]);

  const setting = await AttendanceSettingRepository.findById(input.id);
  if (!setting) throw new NotFoundException("Data setting tidak ditemukan");

  const finalCheckIn = input.checkInTime || setting.checkInTime;
  const finalCheckOut = input.checkOutTime || setting.checkOutTime;

  const [inHour, inMinute] = finalCheckIn.split(":").map(Number);
  const [outHour, outMinute] = finalCheckOut.split(":").map(Number);
  if (outHour * 60 + outMinute <= inHour * 60 + inMinute) {
    throw new BadRequestException("Waktu Check-Out harus lebih besar dari Check-In");
  }

  if (input.isActive) {
    await AttendanceSettingRepository.deactivateAll();
  }

  const { id, ...updateData } = input;
  const updatedSetting = await AttendanceSettingRepository.update(id, updateData);

  return AttendanceSettingDTO.toResponse(updatedSetting);
};

export const activateSettingAction = async (input: TGetSettingById): Promise<TAttendanceSettingResponse> => {
  await serverCheckPermission([PERMISSIONS.MANAGE_ATTENDANCE_SETTING]);

  const setting = await AttendanceSettingRepository.findById(input.id);
  if (!setting) throw new NotFoundException("Data setting tidak ditemukan");

  await AttendanceSettingRepository.deactivateAll();
  const activatedSetting = await AttendanceSettingRepository.update(input.id, { isActive: true });

  return AttendanceSettingDTO.toResponse(activatedSetting);
};

export const deleteSettingAction = async (input: TGetSettingById): Promise<{ success: boolean }> => {
  await serverCheckPermission([PERMISSIONS.MANAGE_ATTENDANCE_SETTING]);

  const setting = await AttendanceSettingRepository.findById(input.id);
  if (!setting) throw new NotFoundException("Data setting tidak ditemukan");

  if (setting.isActive) {
    throw new BadRequestException("Tidak dapat menghapus setting yang sedang aktif. Aktifkan setting lain terlebih dahulu.");
  }

  await AttendanceSettingRepository.delete(input.id);
  return { success: true };
};
