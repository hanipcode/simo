import { prisma } from "../";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as R from "fp-ts/Record";
import * as O from "fp-ts/Option";
import bcrypt from "bcrypt";
import { CreateUser, LoginUser } from "core/user";
import { Prisma } from "@prisma/client";
import { AuthError, DBError, NotFoundError } from "@/helpers/error";

export const dbGetAllUser = () => TE.tryCatch(prisma.user.findMany, E.toError);

export const dbInsertUser = (user: CreateUser) =>
  pipe(
    user,
    E.tryCatchK(
      R.modifyAt("password", (p) => bcrypt.hashSync(p as string, 8)),
      E.toError
    ),
    E.map(O.getOrElseW(() => new Error("Modify Password failed"))),
    TE.fromEither,
    TE.chain(
      TE.tryCatchK(
        (data) => prisma.user.create({ data: data as Prisma.UserCreateInput }),
        (err) => new DBError(err as Error) as Error
      )
    )
  );

export const dbUserLogin = (user: LoginUser) =>
  pipe(
    user,
    TE.tryCatchK(
      (user) => prisma.user.findUniqueOrThrow({ where: { email: user.email } }),
      () => new NotFoundError("user")
    ),
    TE.map(
      E.fromPredicate(
        (dbUser) => bcrypt.compareSync(user.password, dbUser.password),
        () => new AuthError("WrongPassword")
      )
    )
  );
