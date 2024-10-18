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
import basicAuthPlugin from "../accounts/basicAuth";
import { pathToFilesFolder } from "../constants";
import { RequestWithAccount } from "../accounts/basicAuth/types";

export const router: FastifyPluginAsync = async (instance) => {
  await basicAuthPlugin(instance);
  registerMultipartPlugin(instance);
  instance.decorate(
    "messagesService",
    new MessagesService(instance.database.message)
  );

  const messagesInstance =
    instance.withTypeProvider<TypeBoxTypeProvider>() as MessagesInstance;

  messagesInstance.addHook("onRequest", messagesInstance.basicAuth);

  messagesInstance.post(
    "/text",
    { schema: postTextMessageSchema },
    async (req, rep) => {
      const { content } = req.body;
      const account = (req as RequestWithAccount).account;

      try {
        await messagesInstance.messagesService.create({
          content,
          accountId: account.id,
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
      const account = (req as RequestWithAccount).account;
      //TODO: Move to the envs
      const pathToFile = `/uploads/${req.body.file}`;

      try {
        await messagesInstance.messagesService.create({
          type: MessageType.FILE,
          accountId: account.id,
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
          `${pathToFilesFolder}${message.content}`
        );
        const fileType = mime.getType(message.content);

        return res.type(fileType!).send(readStream);
      }

      return res.type("text/plain").send(message?.content);
    }
  );
};

export default router;
