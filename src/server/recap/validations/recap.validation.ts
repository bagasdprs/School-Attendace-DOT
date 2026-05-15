import { z } from "zod";
import { AttendanceStatus } from "@prisma/client";

const DateRangeSchema = z
  .object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format startDate harus YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format endDate harus YYYY-MM-DD"),
    status: z.nativeEnum(AttendanceStatus).optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "startDate tidak boleh lebih besar dari endDate",
    path: ["startDate"],
  });

export const GetStudentRecapSchema = DateRangeSchema.extend({
  studentId: z.coerce.bigint({ message: "ID Siswa tidak valid" }),
});

export const GetClassRecapSchema = DateRangeSchema.extend({
  classId: z.coerce.bigint({ message: "ID Kelas tidak valid" }).optional(),
  search: z.string().optional(),
});

export type TGetStudentRecapInput = z.infer<typeof GetStudentRecapSchema>;
export type TGetClassRecapInput = z.infer<typeof GetClassRecapSchema>;
// export type TRecapInput = TGetStudentRecapInput | TGetClassRecapInput;
