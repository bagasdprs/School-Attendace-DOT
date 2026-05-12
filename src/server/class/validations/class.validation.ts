import { z } from "zod";
import { BaseQuerySchema } from "@/types/index-query-param";

export const GetClassesQuerySchema = BaseQuerySchema;

export const CreateClassSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi").max(100, "Nama kelas maksimal 100 karakter"),
  academicYear: z.string().regex(/^\d{4}\/\d{4}$/, "Format Tahun Ajaran harus YYYY/YYYY (contoh: 2024/2025)"),
});

export const UpdateClassSchema = z.object({
  id: z.coerce.bigint({ message: "ID Kelas wajib ada dan harus valid" }),
  name: z.string().min(1).max(100).optional(),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Format Tahun Ajaran harus YYYY/YYYY")
    .optional(),
});

export const GetClassByIdSchema = z.object({
  id: z.coerce.bigint({ message: "ID Kelas wajib ada dan harus valid" }),
});

export type TGetClassesQuery = z.infer<typeof GetClassesQuerySchema>;
export type TCreateClassInput = z.infer<typeof CreateClassSchema>;
export type TUpdateClassInput = z.infer<typeof UpdateClassSchema>;
export type TGetClassById = z.infer<typeof GetClassByIdSchema>;
