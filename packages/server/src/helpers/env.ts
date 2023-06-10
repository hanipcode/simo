import { z } from "zod";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type Envs = "PORT" | "SALT";

export const env = (value: Envs): string => {
  const envString = z.string().min(1);
  return pipe(
    value,
    E.tryCatchK(envString.parse, E.toError),
    E.fold(
      (err) => {
        throw err;
      },
      (s) => process.env[s]!
    )
  );
};
