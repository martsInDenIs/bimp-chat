import fastifyMultipart, { MultipartFile } from "@fastify/multipart";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fs from "fs";

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

const registerMultipartPlugin = async (instance: FastifyInstance) => {
  instance.register(fastifyMultipart, {
    attachFieldsToBody: "keyValues",
    onFile,
    prefix: "/message/file",
    limits: {
      fileSize: Infinity,
    },
  });
};

export default registerMultipartPlugin;
