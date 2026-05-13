import { z } from "zod";
import { BaseQuerySchema } from "@/types/index-query-param";
import { AttendanceStatus } from "@prisma/client";

export const GetAttendancesQuerySchema = BaseQuerySchema.extend({
  studentId: z.coerce.bigint().optional(),
  classId: z.coerce.bigint().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
  status: z.nativeEnum(AttendanceStatus).optional(),
});

export const CheckInSchema = z.object({
  notes: z.string().optional(),
});

export const CheckOutSchema = z.object({
  notes: z.string().optional(),
});

export const MarkAbsenceSchema = z.object({
  studentId: z.coerce.bigint({ message: "ID Siswa tidak valid" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  status: z.enum([AttendanceStatus.ABSENT, AttendanceStatus.EXCUSED]),
  notes: z.string().optional(),
});

export const UpdateAttendanceSchema = z.object({
  id: z.coerce.bigint({ message: "ID Absensi tidak valid" }),
  status: z.nativeEnum(AttendanceStatus).optional(),
  notes: z.string().optional(),
});

export type TGetAttendancesQuery = z.infer<typeof GetAttendancesQuerySchema>;
export type TCheckInInput = z.infer<typeof CheckInSchema>;
export type TCheckOutInput = z.infer<typeof CheckOutSchema>;
export type TMarkAbsenceInput = z.infer<typeof MarkAbsenceSchema>;
export type TUpdateAttendanceInput = z.infer<typeof UpdateAttendanceSchema>;
