import { Type } from "@fastify/type-provider-typebox";

export const accountRegisterSchema = {
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String(),
  }),
};
