import { env } from "@/helpers/env";
import fastifyCors from "@fastify/cors";
import { app } from "./server";

const PORT = env("PORT");

app.register(fastifyCors, { origin: true });

export const start = async () => {
  try {
    app.listen({ port: Number(PORT), host: "0.0.0.0" }, () => {
      console.log(`server run on ${PORT}`);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
