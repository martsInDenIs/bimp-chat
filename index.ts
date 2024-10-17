import Fastify from "fastify";
import envPlugin from "./src/envs";
import databasePlugin from "./src/database";

const fastify = Fastify({
  logger: true,
});

await fastify.register(envPlugin);
await fastify.register(databasePlugin);

try {
  await fastify.listen({ port: fastify.config.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
