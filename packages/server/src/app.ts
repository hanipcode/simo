import { app } from "./server";
import { cors } from "@elysiajs/cors";
import { env } from "@/helpers/env";

const PORT = Number(env("PORT"));

export const start = () => {
  // @ts-ignore
  app.use(cors()).listen(PORT, () => {
    console.log(` app is running and listened on port ${PORT}`);
  });
};
