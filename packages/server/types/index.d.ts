import * as fastify from "fastify";
declare module "fastify-cors";
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => void;
  }
}
