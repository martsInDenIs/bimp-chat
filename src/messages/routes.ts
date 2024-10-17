import { FastifyPluginAsync } from "fastify";
import MessagesService from "./service";
import { MessagesInstance } from "./types";
import { MessageType, Message } from "@prisma/client";
import fs from "fs";
import fastifyMultipart, { MultipartFile } from "@fastify/multipart";
import mime from "mime";

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
    limits: {
      fileSize: Infinity,
    },
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

  messagesInstance.get<{
    Querystring: { skip: number; take: number } | { page: number };
  }>("/list", async (req, res) => {
    const messagesNumber = await messagesInstance.messagesService.count();
    const messages = await messagesInstance.messagesService.get(req.query);

    return { messagesNumber, messages };
  });
  messagesInstance.get<{ Querystring: { id: string } }>(
    "/content",
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
