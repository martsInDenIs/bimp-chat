import { FastifyEnvOptions } from "@fastify/env";

// TODO: Bind the type with the schema below
export type ENVS = {
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

export const config: FastifyEnvOptions = {
  confKey: "config",
  dotenv: true,
  schema,
};
