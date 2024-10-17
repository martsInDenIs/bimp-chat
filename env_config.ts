import { FastifyEnvOptions } from "@fastify/env";

type ENVS = {
  PORT: number;
};

const schema: FastifyEnvOptions["schema"] = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "number",
    },
  },
};

export const envConfig: FastifyEnvOptions = {
  confKey: "config",
  dotenv: true,
  schema,
};

declare module "fastify" {
  interface FastifyInstance {
    config: ENVS;
  }
}
