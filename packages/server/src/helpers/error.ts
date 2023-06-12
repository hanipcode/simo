import { FastifyReply } from "fastify";
import { z, ZodIssue } from "zod";
import { createErrorResponse } from "./response";

export class NotFoundError extends Error {
  static code = 404;
  constructor(path: string) {
    super(`${path} Not Found`);
    this.name = "NotFoundError";
  }
}

export class AuthError extends Error {
  static code = 401;
  public reason: string = "Unknown";
  constructor(reason: string) {
    super(`Authentication Error. reason: ${reason}`);
    this.name = "AuthError";
    this.reason = reason;
  }
}

export class InternalError extends Error {
  static code = 500;
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}

export class BodyError extends z.ZodError {
  static code = 400;
  constructor(issues: ZodIssue[]) {
    super(issues);
    this.name = "BodyError";
  }
}

export class DBError extends Error {
  static code = 422;

  meta: any;
  constructor(prismaError: Error) {
    super("ERR_DB_INSERT");
    Object.getOwnPropertyNames(prismaError).forEach((name) => {
      (this as any)[name] = (prismaError as any)[name];
    });
    this.name = "DBError";
  }
}

export const logError = <T extends Error>(error: T): T => {
  console.log(error);
  return error;
};

export const replyErrorEffect =
  (reply: FastifyReply, specificCode: number | null = null) =>
  (err: Error) => {
    const codeMap: Record<string, number> = {
      AuthError: 401,
      BodyError: 400,
      NotFoundError: 404,
      InternalError: 500,
      DBError: 422,
    };
    const statusCode: number = codeMap[err.name] || codeMap.InternalError;

    reply.status(statusCode).send(
      createErrorResponse({
        ...err,
        error_code: specificCode || statusCode,
        reason: (err as AuthError).reason || undefined,
      })
    );
    return err;
  };
