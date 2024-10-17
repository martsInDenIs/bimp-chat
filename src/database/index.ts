import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    database: PrismaClient;
  }
}

const databasePlugin: FastifyPluginAsync = fastifyPlugin(async (instance) => {
  const client = new PrismaClient();
  instance.decorate("database", client);
});

export default databasePlugin;
