import { config, ENVS } from "./config.js";
import fastifyPlugin from "fastify-plugin";
import fastifyEnv from "@fastify/env";

declare module "fastify" {
  interface FastifyInstance {
    config: ENVS;
  }
}

const envPlugin = fastifyPlugin(async (instance) => {
  instance.register(fastifyEnv, config);
});

export default envPlugin;
