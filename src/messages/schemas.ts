import { Type } from "@fastify/type-provider-typebox";

export const postTextMessageSchema = {
  body: Type.Object({
    content: Type.String(),
  }),
};

export const postFileMessageSchema = {
  body: Type.Object({
    file: Type.String(),
  }),
};

export const getMessagesListSchema = {
  querystring: Type.Union([
    Type.Object({ page: Type.Number({ minimum: 1 }) }),
    Type.Object({
      skip: Type.Number({ minimum: 0 }),
      take: Type.Number({ minimum: 1 }),
    }),
  ]),
};

export const getMessageContentSchema = {
  querystring: Type.Object({
    id: Type.String(),
  }),
};
