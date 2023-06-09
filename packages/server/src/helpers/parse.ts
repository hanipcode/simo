import { z } from "zod";
import * as E from "fp-ts/Either";

export const parseEither = <T extends z.ZodType, Z>(
  parser: T,
  value: Z
): E.Either<unknown, z.output<T>> => {
  return E.tryCatch(
    () => parser.parse(value),
    (error) => error
  );
};
