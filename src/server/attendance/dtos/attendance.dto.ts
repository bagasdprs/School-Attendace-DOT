import { Attendance, Student, Class } from "@prisma/client";

export type TAttendanceEntity = Attendance & {
  student?: (Student & { class?: Class | null }) | null;
};

export interface TAttendanceResponse {
  id: string;
  studentId: string;
  studentName?: string;
  className?: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  notes: string | null;
}

export const AttendanceDTO = {
  toResponse(attendance: TAttendanceEntity): TAttendanceResponse {
    return {
      id: attendance.id.toString(),
      studentId: attendance.studentId.toString(),
      studentName: attendance.student?.name,
      className: attendance.student?.class?.name,
      date: attendance.date.toISOString().split("T")[0],
      checkInTime: attendance.checkInTime?.toISOString() || null,
      checkOutTime: attendance.checkOutTime?.toISOString() || null,
      status: attendance.status,
      notes: attendance.notes,
    };
  },

  toResponseList(attendances: TAttendanceEntity[]): TAttendanceResponse[] {
    return attendances.map((a) => this.toResponse(a));
  },
};
