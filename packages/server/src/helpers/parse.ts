import { z, ZodError } from "zod";
import * as E from "fp-ts/Either";
import { BodyError, InternalError } from "./error";

type Parse = <T extends z.ZodType, Z = ReturnType<T["parse"]>>(
  parser: T
) => (
  data: unknown,
  params?: Partial<z.ParseParams> | undefined
) => E.Either<BodyError | InternalError, Z>;
export const parse: Parse = <T extends z.ZodType>(parser: T) =>
  E.tryCatchK(parser.parse, (err) => {
    if (err instanceof ZodError) {
      return new BodyError(err.issues);
    }
    return new InternalError(`Error when parsing`);
  });
