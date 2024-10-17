import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    database: PrismaClient;
  }
}

const databasePlugin: FastifyPluginAsync = async (instance) => {
  const client = new PrismaClient();
  instance.decorate("database", client);
};

export default databasePlugin;
