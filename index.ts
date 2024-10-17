import Fastify from "fastify";
import envPlugin from "./src/envs";

const fastify = Fastify({
  logger: true,
});

await fastify.register(envPlugin);

try {
  await fastify.listen({ port: fastify.config.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
