import { TRPCError } from "@trpc/server";

export class BadRequestException extends TRPCError {
  constructor(message: string) {
    super({ code: "BAD_REQUEST", message });
  }
}

export class UnauthorizedException extends TRPCError {
  constructor() {
    super({ code: "UNAUTHORIZED", message: "Sesi Anda telah berakhir atau tidak valid." });
  }
}

export class ForbiddenException extends TRPCError {
  constructor() {
    super({ code: "FORBIDDEN", message: "Anda tidak memiliki izin untuk akses ini." });
  }
}

export class NotFoundException extends TRPCError {
  constructor(message: string) {
    super({ code: "NOT_FOUND", message });
  }
}
