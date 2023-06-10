import { dbGetAllUser, dbInsertUser } from "@/db/modules/user";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { CreateUser, UserOutput } from "@/core/user/types";
import { FastifyPluginCallback } from "fastify";
import { createErrorResponse, createSuccessResponse } from "@/helpers/response";

export const userRouter: FastifyPluginCallback = (app, _, done) => {
  app.get("/", (_, reply) =>
    pipe(
      dbGetAllUser(),
      TE.map(A.map(E.tryCatchK(UserOutput.parse, E.toError))),
      TE.map(A.sequence(E.Applicative)),
      TE.map(E.getOrElseW(E.toError)),
      TE.map((data) => reply.send(createSuccessResponse(data))),
      TE.mapLeft((error) => reply.status(500).send(createErrorResponse(error)))
    )()
  );

  app.post("/", {}, (req, reply) =>
    pipe(
      req.body,
      E.tryCatchK(CreateUser.parse, E.toError),
      E.mapLeft((err) => {
        reply.status(400).send(createErrorResponse(err));
        return err;
      }),
      TE.fromEither,
      TE.chain(dbInsertUser),
      TE.map((data) => reply.send(createSuccessResponse(data))),
      TE.mapLeft((err) => reply.status(500).send(createErrorResponse(err)))
    )()
  );

  done();
};
