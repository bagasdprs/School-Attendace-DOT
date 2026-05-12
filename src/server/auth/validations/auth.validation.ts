import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  name: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
});

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type TRegisterInput = z.infer<typeof RegisterSchema>;
export type TLoginInput = z.infer<typeof LoginSchema>;
