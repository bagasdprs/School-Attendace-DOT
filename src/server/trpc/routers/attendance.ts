import { createTRPCRouter, publicProcedure } from "../trpc";
import { CheckInSchema, CheckOutSchema, GetAttendancesQuerySchema, MarkAbsenceSchema, UpdateAttendanceSchema } from "@/server/attendance/validations/attendance.validation";
import { checkInAction, checkOutAction, getAttendancesAction, markAbsenceAction, updateAttendanceAction } from "@/server/attendance/actions/attendance.action";

export const attendanceRouter = createTRPCRouter({
  getAttendances: publicProcedure.input(GetAttendancesQuerySchema).query(async ({ input }) => await getAttendancesAction(input)),

  checkIn: publicProcedure.input(CheckInSchema).mutation(async ({ input }) => await checkInAction(input)),

  checkOut: publicProcedure.input(CheckOutSchema).mutation(async ({ input }) => await checkOutAction(input)),

  markAbsence: publicProcedure.input(MarkAbsenceSchema).mutation(async ({ input }) => await markAbsenceAction(input)),

  updateAttendance: publicProcedure.input(UpdateAttendanceSchema).mutation(async ({ input }) => await updateAttendanceAction(input)),
});
