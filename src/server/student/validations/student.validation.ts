import { z } from "zod";
import { BaseQuerySchema } from "@/types/index-query-param";

/**
 * Schema Query Get Students (Tabel)
 */
export const GetStudentsQuerySchema = BaseQuerySchema.extend({
  classId: z.coerce.bigint({ message: "Format Filter ID Kelas tidak valid" }).optional(),
});

/**
 * Schema Create Student
 */
export const CreateStudentSchema = z.object({
  nis: z.string().min(1, "NIS wajib diisi").max(20, "NIS maksimal 20 karakter"), // Sesuaikan dengan @db.VarChar(20)
  name: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid").max(255, "Email maksimal 255 karakter"),
  classId: z.coerce.bigint({
    message: "Kelas wajib dipilih dan format ID harus valid",
  }),
});

/**
 * Schema Update Student
 */
export const UpdateStudentSchema = z.object({
  id: z.coerce.bigint({ message: "ID Siswa wajib ada dan harus valid" }),
  nis: z.string().min(1).max(20, "NIS maksimal 20 karakter").optional(),
  name: z.string().min(1).max(255, "Nama maksimal 255 karakter").optional(),
  email: z.string().email("Format email tidak valid").max(255).optional(),
  classId: z.coerce.bigint({ message: "Format ID Kelas tidak valid" }).optional(),
});

/**
 * Schema untuk mendapatkan data tunggal / menghapus data
 */
export const GetStudentByIdSchema = z.object({
  id: z.coerce.bigint({ message: "ID Siswa wajib ada dan harus valid" }),
});

export type TGetStudentsQuery = z.infer<typeof GetStudentsQuerySchema>;
export type TCreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type TUpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type TGetStudentById = z.infer<typeof GetStudentByIdSchema>;
