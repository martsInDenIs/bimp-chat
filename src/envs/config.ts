import { FastifyEnvOptions } from "@fastify/env";

// TODO: Bind the type with the schema below
export type ENVS = {
  PORT: number;
  HOST: string;
};

const schema: FastifyEnvOptions["schema"] = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "number",
    },
    HOST: {
      type: "string",
    },
  },
};

export const config: FastifyEnvOptions = {
  confKey: "config",
  dotenv: true,
  schema,
};
