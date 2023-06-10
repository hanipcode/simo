import { prisma } from "../";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";
import bcrypt from "bcrypt";
import { CreateUser } from "@/core/user/types";
import { env } from "@/helpers/env";
import { Prisma } from "@prisma/client";
import { logError } from "@/helpers/error";

export const dbGetAllUser = () => TE.tryCatch(prisma.user.findMany, E.toError);

export const dbInsertUser = (user: CreateUser) =>
  pipe(
    user,
    E.tryCatchK(
      R.modifyAt("password", (p) => bcrypt.hashSync(p as string, 8)),
      E.toError
    ),
    E.map(O.getOrElseW(() => new Error("Modify Password failed"))),
    E.mapLeft(logError),
    TE.fromEither,
    TE.chain(
      TE.tryCatchK(
        (data) => prisma.user.create({ data: data as Prisma.UserCreateInput }),
        E.toError
      )
    )
  );
