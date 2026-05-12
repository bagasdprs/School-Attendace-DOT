import { createTRPCRouter, publicProcedure } from "../trpc";
import { CreateSettingSchema, GetSettingByIdSchema, GetSettingsQuerySchema, UpdateSettingSchema } from "@/server/attendance-setting/validations/attendance-setting.validation";
import { activateSettingAction, createSettingAction, deleteSettingAction, getActiveSettingAction, getSettingsAction, updateSettingAction } from "@/server/attendance-setting/actions/attendance-setting.action";

export const attendanceSettingRouter = createTRPCRouter({
  getSettings: publicProcedure.input(GetSettingsQuerySchema).query(async ({ input }) => await getSettingsAction(input)),

  getActiveSetting: publicProcedure.query(async () => await getActiveSettingAction()),

  createSetting: publicProcedure.input(CreateSettingSchema).mutation(async ({ input }) => await createSettingAction(input)),

  updateSetting: publicProcedure.input(UpdateSettingSchema).mutation(async ({ input }) => await updateSettingAction(input)),

  activateSetting: publicProcedure.input(GetSettingByIdSchema).mutation(async ({ input }) => await activateSettingAction(input)),

  deleteSetting: publicProcedure.input(GetSettingByIdSchema).mutation(async ({ input }) => await deleteSettingAction(input)),
});
