import { env } from "@/helpers/env";
import fastifyCors from "fastify-cors";
import { app } from "./server";

const PORT = env("PORT");

app.register(fastifyCors, { origin: true });

export const start = async () => {
  try {
    await app.listen(PORT, "0.0.0.0");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
