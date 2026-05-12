"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UnauthorizedException, ForbiddenException } from "@/errors/base.exception";
import { PERMISSIONS } from "@/common/enum/permission.enum";
import { ROLE_PERMISSIONS } from "@/common/constants/role-permission";
import { UserRole } from "@prisma/client";

const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE_NAME = "auth_session";

export interface TSessionPayload {
  userId: string;
  role: UserRole;
}

export const serverCheckPermission = async (requiredPermissions: PERMISSIONS[]): Promise<TSessionPayload> => {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (!token) {
    throw new UnauthorizedException();
  }

  let payload: unknown;

  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    payload = verified.payload;
  } catch (error) {
    throw new UnauthorizedException();
  }

  if (typeof payload !== "object" || payload === null || !("userId" in payload) || !("role" in payload)) {
    throw new UnauthorizedException();
  }

  const session = payload as TSessionPayload;
  const userPermissions = ROLE_PERMISSIONS[session.role];

  const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    throw new ForbiddenException();
  }

  return session;
};
