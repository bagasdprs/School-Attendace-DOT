import { z } from "zod";
import { BaseQuerySchema } from "@/types/index-query-param";

export const GetSettingsQuerySchema = BaseQuerySchema;

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const CreateSettingSchema = z
  .object({
    name: z.string().min(1, "Nama setting wajib diisi").max(255),
    checkInTime: z.string().regex(timeRegex, "Format waktu harus HH:mm"),
    checkOutTime: z.string().regex(timeRegex, "Format waktu harus HH:mm"),
    lateThreshold: z.number().int().min(0, "Threshold tidak boleh negatif").default(15), //
    isActive: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const [inHour, inMinute] = data.checkInTime.split(":").map(Number);
      const [outHour, outMinute] = data.checkOutTime.split(":").map(Number);
      return outHour * 60 + outMinute > inHour * 60 + inMinute;
    },
    {
      message: "Waktu Check-Out harus lebih besar dari Check-In",
      path: ["checkOutTime"],
    },
  );

export const UpdateSettingSchema = z.object({
  id: z.coerce.bigint({ message: "ID Setting wajib ada dan harus valid" }),
  name: z.string().min(1).max(255).optional(),
  checkInTime: z.string().regex(timeRegex).optional(),
  checkOutTime: z.string().regex(timeRegex).optional(),
  lateThreshold: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const GetSettingByIdSchema = z.object({
  id: z.coerce.bigint({ message: "ID Setting wajib ada dan harus valid" }),
});

export type TGetSettingsQuery = z.infer<typeof GetSettingsQuerySchema>;
export type TCreateSettingInput = z.infer<typeof CreateSettingSchema>;
export type TUpdateSettingInput = z.infer<typeof UpdateSettingSchema>;
export type TGetSettingById = z.infer<typeof GetSettingByIdSchema>;
