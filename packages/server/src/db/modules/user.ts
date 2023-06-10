import { prisma } from "../";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";

export const dbGetAllUser = () =>
  pipe(
    TE.tryCatch(() => {
      return prisma.user.findMany();
    }, E.toError)
  );
