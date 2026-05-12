import { createTRPCRouter, publicProcedure } from "../trpc";
import { GetClassRecapSchema, GetStudentRecapSchema } from "@/server/recap/validations/recap.validation";
import { exportClassRecapAction, getClassRecapAction, getStudentRecapAction } from "@/server/recap/actions/recap.action";

export const recapRouter = createTRPCRouter({
  getStudentRecap: publicProcedure.input(GetStudentRecapSchema).query(async ({ input }) => await getStudentRecapAction(input)),

  getClassRecap: publicProcedure.input(GetClassRecapSchema).query(async ({ input }) => await getClassRecapAction(input)),

  exportRecap: publicProcedure.input(GetClassRecapSchema).mutation(async ({ input }) => await exportClassRecapAction(input)),
});
