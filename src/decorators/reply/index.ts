import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  interface FastifyReply {
    created(payload?: unknown): void;
    conflict(): void;
    serverError(err: unknown): void;
    unauthorized(): void;
  }
}

const replyPlugin: FastifyPluginAsync = fastifyPlugin(async (instance) => {
  instance.decorateReply("created", function (payload) {
    this.status(201).send(payload);
  });

  instance.decorateReply("conflict", function () {
    this.status(409).send();
  });
  instance.decorateReply("unauthorized", function () {
    this.status(401).send();
  });

  instance.decorateReply("serverError", function (err) {
    this.status(500).send(err);
  });
});

export default replyPlugin;
