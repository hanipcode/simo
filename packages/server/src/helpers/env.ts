import { z } from "zod";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { ValidationError } from "@/helpers/error";
import { parseEither } from "./parse";

type Envs = "PORT" | "JWT_SECRET";

export const env = (value: Envs) => {
  const envString = z.string().min(1);
  return pipe(
    parseEither(envString, value),
    E.fold(
      (err) => {
        if (err instanceof z.ZodError) {
          throw new ValidationError(err.message);
        }
        throw err;
      },
      (s) => process.env[s]
    )
  );
};
