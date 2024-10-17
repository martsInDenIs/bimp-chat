import { FastifyPluginAsync } from "fastify";
import MessagesService from "./service";
import { MessagesInstance } from "./types";
import { MessageType, Message } from "@prisma/client";
import fs from "fs";
import fastifyMultipart, { MultipartFile } from "@fastify/multipart";

const onFile = async (part: MultipartFile) => {
  const writeStream = fs.createWriteStream(
    `${process.cwd()}/uploads/${part.filename}`
  );
  part.file.pipe(writeStream);

  await new Promise((response, reject) => {
    writeStream.on("finish", () => {
      console.log("File saving done!");
      // TODO: Think about solution for the types below
      part.value = part.filename;
      response("done");
    });

    writeStream.on("error", () => {
      reject();
    });
  });
};

// TODO: Create schemas
export const router: FastifyPluginAsync = async (instance) => {
  instance.register(fastifyMultipart, {
    attachFieldsToBody: "keyValues",
    onFile,
    prefix: "/message/file",
  });
  instance.decorate(
    "messagesService",
    new MessagesService(instance.database.message)
  );

  const messagesInstance = instance as MessagesInstance;
  messagesInstance.post<{
    Body: {
      type: MessageType;
      accountId: Message["accountId"];
      content: Message["content"];
    };
  }>("/text", (req, res) => {
    messagesInstance.messagesService.create(req.body);
  });
  messagesInstance.post<{ Body: MultipartFile & Pick<Message, "accountId"> }>(
    "/file",
    async (req, res) => {
      const pathToFile = `/uploads/${req.body.file}`;

      await messagesInstance.messagesService.create({
        type: MessageType.FILE,
        accountId: req.body.accountId,
        content: pathToFile,
      });

      res.status(200);
    }
  );
};

export default router;
