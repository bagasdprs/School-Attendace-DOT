import { z } from "zod";

export const BaseQuerySchema = z.object({
  page: z.coerce.number().min(1, "Halaman minimal 1").default(1),
  perPage: z.coerce.number().min(1, "Jumlah per halaman minimal 1").default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TBaseQueryParam = z.infer<typeof BaseQuerySchema>;
