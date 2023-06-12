import { dbGetAllUser, dbInsertUser, dbUserLogin } from "@/db/modules/user";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as R from "fp-ts/Record";
import * as A from "fp-ts/Array";
import { CreateUser, LoginUser, UserOutput } from "@/core/user/types";
import { FastifyPluginCallback } from "fastify";
import { createSuccessResponse } from "@/helpers/response";
import { parse } from "@/helpers/parse";
import { replyErrorEffect } from "@/helpers/error";
import { sanitizeUser } from "@/core/user/helper/sanitize";

export const userRouter: FastifyPluginCallback = (app, _, done) => {
  app.get("/", { onRequest: [app.authenticate] }, (_, reply) =>
    pipe(
      dbGetAllUser(),
      TE.map(A.map(R.deleteAt("password"))),
      TE.map(A.map(parse(UserOutput))),
      TE.map(A.sequence(E.Applicative)),
      TE.map(E.getOrElseW(replyErrorEffect(reply))),
      TE.map((data) => reply.send(createSuccessResponse(data))),
      TE.mapLeft(replyErrorEffect(reply))
    )()
  );

  app.post("/", {}, (req, reply) =>
    pipe(
      req.body,
      parse(CreateUser),
      E.mapLeft(replyErrorEffect(reply)),
      TE.fromEither,
      TE.chain(dbInsertUser),
      TE.map((data) => reply.send(createSuccessResponse(data))),
      TE.mapLeft(replyErrorEffect(reply))
    )()
  );

  app.post("/auth", {}, (req, reply) => {
    pipe(
      req.body,
      parse(LoginUser),
      E.mapLeft(replyErrorEffect(reply)),
      TE.fromEither,
      TE.chain(dbUserLogin),
      TE.map(E.map(sanitizeUser())),
      TE.map(E.chain(parse(UserOutput))),
      TE.map(E.getOrElseW(replyErrorEffect(reply))),
      TE.map((data) =>
        pipe(app.jwt.sign(data), (accessToken) => ({ ...data, accessToken }))
      ),
      TE.map((data) => reply.send(createSuccessResponse(data))),
      TE.mapLeft(replyErrorEffect(reply))
    )();
  });
  done();
};
