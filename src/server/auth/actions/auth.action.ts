"use server";

import { AuthRepository } from "../repositories/auth.repository";
import { TLoginInput, TRegisterInput } from "../validations/auth.validation";
import { AuthDTO, TUserResponse } from "../dtos/auth.dto";
import { BadRequestException, UnauthorizedException } from "@/errors/base.exception";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE_NAME = "auth_session";

async function createSession(userId: string, role: string) {
  const token = await new SignJWT({ userId, role }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(SECRET_KEY);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
}

export const registerAction = async (input: TRegisterInput): Promise<TUserResponse> => {
  const existingUser = await AuthRepository.findByEmail(input.email);
  if (existingUser) throw new BadRequestException("Email sudah terdaftar");

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await AuthRepository.create({
    ...input,
    password: hashedPassword,
  });

  return AuthDTO.toResponse(user);
};

export const loginAction = async (input: TLoginInput): Promise<TUserResponse> => {
  const user = await AuthRepository.findByEmail(input.email);
  if (!user) throw new BadRequestException("Email atau password salah");

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) throw new BadRequestException("Email atau password salah");

  await createSession(user.id.toString(), user.role);

  return AuthDTO.toResponse(user);
};

export const logoutAction = async () => {
  cookies().delete(COOKIE_NAME);
};

export const getMeAction = async (): Promise<TUserResponse> => {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) throw new UnauthorizedException();

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = BigInt(payload.userId as string);

    const user = await AuthRepository.findById(userId);
    if (!user) throw new UnauthorizedException();

    return AuthDTO.toResponse(user);
  } catch (error) {
    throw new UnauthorizedException();
  }
};
