import { createTRPCRouter, publicProcedure } from "../trpc";
import { CreateClassSchema, GetClassByIdSchema, GetClassesQuerySchema, UpdateClassSchema } from "@/server/class/validations/class.validation";
import { createClassAction, deleteClassAction, getClassByIdAction, getClassesAction, updateClassAction } from "@/server/class/actions/class.action";

export const classRouter = createTRPCRouter({
  getClasses: publicProcedure.input(GetClassesQuerySchema).query(async ({ input }) => await getClassesAction(input)),

  getClass: publicProcedure.input(GetClassByIdSchema).query(async ({ input }) => await getClassByIdAction(input)),

  createClass: publicProcedure.input(CreateClassSchema).mutation(async ({ input }) => await createClassAction(input)),

  updateClass: publicProcedure.input(UpdateClassSchema).mutation(async ({ input }) => await updateClassAction(input)),

  deleteClass: publicProcedure.input(GetClassByIdSchema).mutation(async ({ input }) => await deleteClassAction(input)),
});
