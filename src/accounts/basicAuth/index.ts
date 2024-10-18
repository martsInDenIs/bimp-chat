import { FastifyInstance } from "fastify";
import fastifyBasicAuth from "@fastify/basic-auth";
import validate from "./validate";
import AccountsService from "../service";

const basicAuthPlugin = async (instance: FastifyInstance) => {
  instance.decorate(
    "accountsService",
    new AccountsService(instance.database.account)
  );
  await instance.register(fastifyBasicAuth, { validate });
};

export default basicAuthPlugin;
