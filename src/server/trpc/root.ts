import { authRouter } from "./routers/auth";
import { createTRPCRouter } from "./trpc";
import { studentRouter } from "./routers/student";
import { classRouter } from "./routers/class";
import { attendanceSettingRouter } from "./routers/attendance-setting";
import { attendanceRouter } from "./routers/attendance";
import { recapRouter } from "./routers/recap";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  student: studentRouter,
  class: classRouter,
  recap: recapRouter,
  attendance: attendanceRouter,
  attendanceSetting: attendanceSettingRouter,
});

export type AppRouter = typeof appRouter;
