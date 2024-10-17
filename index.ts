import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import { envConfig } from "./env_config.js";

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyEnv, envConfig);

try {
  await fastify.listen({ port: fastify.config.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
