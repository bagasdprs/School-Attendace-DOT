import { createTRPCRouter, publicProcedure } from "../trpc";
import { CreateStudentSchema, GetStudentByIdSchema, GetStudentsQuerySchema, UpdateStudentSchema } from "@/server/student/validations/student.validation";
import { createStudentAction, deleteStudentAction, getDashboardSummaryAction, getStudentByIdAction, getStudentsAction, updateStudentAction } from "@/server/student/actions/student.action";

export const studentRouter = createTRPCRouter({
  getDashboardSummary: publicProcedure.query(async () => {
    return await getDashboardSummaryAction();
  }),

  getStudents: publicProcedure.input(GetStudentsQuerySchema).query(async ({ input }) => {
    return await getStudentsAction(input);
  }),

  getStudent: publicProcedure.input(GetStudentByIdSchema).query(async ({ input }) => {
    return await getStudentByIdAction(input);
  }),

  createStudent: publicProcedure.input(CreateStudentSchema).mutation(async ({ input }) => {
    return await createStudentAction(input);
  }),

  updateStudent: publicProcedure.input(UpdateStudentSchema).mutation(async ({ input }) => {
    return await updateStudentAction(input);
  }),

  deleteStudent: publicProcedure.input(GetStudentByIdSchema).mutation(async ({ input }) => {
    return await deleteStudentAction(input);
  }),
});
