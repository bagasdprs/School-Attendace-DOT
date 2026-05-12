import { AttendanceSetting } from "@prisma/client";

export interface TAttendanceSettingResponse {
  id: string;
  name: string;
  checkInTime: string;
  checkOutTime: string;
  lateThreshold: number;
  isActive: boolean;
  createdAt: string;
}

export const AttendanceSettingDTO = {
  toResponse(setting: AttendanceSetting): TAttendanceSettingResponse {
    return {
      id: setting.id.toString(),
      name: setting.name,
      checkInTime: setting.checkInTime,
      checkOutTime: setting.checkOutTime,
      lateThreshold: setting.lateThreshold,
      isActive: setting.isActive,
      createdAt: setting.createdAt.toISOString(),
    };
  },

  toResponseList(settings: AttendanceSetting[]): TAttendanceSettingResponse[] {
    return settings.map((s) => this.toResponse(s));
  },
};
