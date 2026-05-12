import { User } from "@prisma/client";

export interface TUserResponse {
  id: string; // Konversi BigInt ke string
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export const AuthDTO = {
  toResponse(user: User): TUserResponse {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  },
};
