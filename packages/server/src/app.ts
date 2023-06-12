import { app } from "./server";
import cors from "@fastify/cors";
import { env } from "@/helpers/env";
import { prisma } from "./db";
import { userRouter } from "./routers/modules/user";
import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { createErrorResponse } from "./helpers/response";
import { AuthError } from "./helpers/error";

const PORT = Number(env("PORT"));

export const start = async () => {
  // @ts-ignore
  app.register(cors);
  app.register(userRouter, { prefix: "/user" });
  app.register(fastifyJwt, {
    secret: env("JWT"),
  });
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(createErrorResponse(new AuthError("No JWT in Header")));
      }
    }
  );
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });
  } catch (err) {
    console.log(err);
    prisma.$disconnect();
    process.exit(1);
  }
};

start();
