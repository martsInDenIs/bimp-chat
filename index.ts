import Fastify from "fastify";
import envPlugin from "./src/envs";
import databasePlugin from "./src/database";
import accountsPlugin from "./src/accounts";
import messagesPlugin from "./src/messages";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import replyPlugin from "./src/decorators/reply";
import fastifyBcrypt from "fastify-bcrypt";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(fastifyBcrypt);
await fastify.register(envPlugin);
await fastify.register(databasePlugin);
await fastify.register(replyPlugin);

fastify.register(accountsPlugin);
fastify.register(messagesPlugin);

try {
  await fastify.listen({
    port: fastify.config.PORT,
    host: fastify.config.HOST,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
