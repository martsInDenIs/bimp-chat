import { FastifyInstance } from "fastify";
import fastifyBasicAuth from "@fastify/basic-auth";
import validate from "./validate";
import AccountsService from "../service";
import fastifyBcrypt from "fastify-bcrypt";

const basicAuthPlugin = async (instance: FastifyInstance) => {
  instance.decorate(
    "accountsService",
    new AccountsService(instance.database.account)
  );
  instance.register(fastifyBcrypt);

  await instance.register(fastifyBasicAuth, { validate });
};

export default basicAuthPlugin;
