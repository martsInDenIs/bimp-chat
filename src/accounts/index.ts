import { FastifyPluginAsync } from "fastify";
import router from "./router";

const accountsPlugin: FastifyPluginAsync = async (instance) => {
  instance.register(router, { prefix: "account" });
};

export default accountsPlugin;
