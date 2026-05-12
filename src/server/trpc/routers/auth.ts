import { createTRPCRouter, publicProcedure } from "../trpc";
import { LoginSchema, RegisterSchema } from "@/server/auth/validations/auth.validation";
import { loginAction, registerAction, logoutAction, getMeAction } from "@/server/auth/actions/auth.action";

export const authRouter = createTRPCRouter({
  /**
   * Endpoint: auth.register
   */
  register: publicProcedure.input(RegisterSchema).mutation(async ({ input }) => {
    return await registerAction(input);
  }),

  /**
   * Endpoint: auth.login
   */
  login: publicProcedure.input(LoginSchema).mutation(async ({ input }) => {
    return await loginAction(input);
  }),

  /**
   * Endpoint: auth.logout
   */
  logout: publicProcedure.mutation(async () => {
    await logoutAction();
    return { success: true };
  }),

  /**
   * Endpoint: auth.me
   * Mengambil data session user yang sedang login
   */
  me: publicProcedure.query(async () => {
    return await getMeAction();
  }),
});
