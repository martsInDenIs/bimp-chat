import { FastifyPluginAsync } from "fastify";
import MessagesService from "./service";
import { MessagesInstance } from "./types";
import { MessageType } from "@prisma/client";
import fs from "fs";
import mime from "mime";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  getMessageContentSchema,
  getMessagesListSchema,
  postFileMessageSchema,
  postTextMessageSchema,
} from "./schemas";
import registerMultipartPlugin from "../multipart";

// TODO: Create schemas
export const router: FastifyPluginAsync = async (instance) => {
  registerMultipartPlugin(instance);
  instance.decorate(
    "messagesService",
    new MessagesService(instance.database.message)
  );

  const messagesInstance =
    instance.withTypeProvider<TypeBoxTypeProvider>() as MessagesInstance;

  messagesInstance.post(
    "/text",
    { schema: postTextMessageSchema },
    async (req, rep) => {
      try {
        await messagesInstance.messagesService.create({
          ...req.body,
          type: MessageType.TEXT,
        });
        return rep.created();
      } catch (err) {
        return rep.serverError(err);
      }
    }
  );

  messagesInstance.post(
    "/file",
    { schema: postFileMessageSchema },
    async (req, res) => {
      const pathToFile = `/uploads/${req.body.file}`;

      try {
        await messagesInstance.messagesService.create({
          type: MessageType.FILE,
          accountId: req.body.accountId,
          content: pathToFile,
        });
        return res.created();
      } catch (err) {
        fs.unlink(`${process.cwd}${pathToFile}`, (err) => {
          instance.log.error(err);
        });
        return res.serverError(err);
      }
    }
  );

  messagesInstance.get(
    "/list",
    { schema: getMessagesListSchema },
    async (req) => {
      const messagesNumber = await messagesInstance.messagesService.count();
      const messages = await messagesInstance.messagesService.get(req.query);

      return { messagesNumber, messages };
    }
  );
  messagesInstance.get(
    "/content",
    { schema: getMessageContentSchema },
    async (req, res) => {
      const message = await messagesInstance.messagesService.getById(
        req.query.id
      );

      if (message?.type === MessageType.FILE) {
        const readStream = fs.createReadStream(
          `${process.cwd()}${message.content}`
        );
        const fileType = mime.getType(message.content);

        return res.type(fileType!).send(readStream);
      }

      return res.type("text/plain").send(message?.content);
    }
  );
};

export default router;
