import { app } from "./server";
import cors from "@fastify/cors";
import { env } from "@/helpers/env";
import { prisma } from "./db";
import { userRouter } from "./routers/modules/user";

const PORT = Number(env("PORT"));

export const start = async () => {
  // @ts-ignore
  app.register(cors);
  app.register(userRouter, { prefix: "/user" });

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
