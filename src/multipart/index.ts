import fastifyMultipart, { MultipartFile } from "@fastify/multipart";
import { FastifyInstance, FastifyRequest } from "fastify";
import fs from "fs";
import { MultipartFileWithResponseValue } from "./types";

const onFile = async function (this: FastifyRequest, part: MultipartFile) {
  const writeStream = fs.createWriteStream(
    `${process.cwd()}/uploads/${part.filename}`
  );
  part.file.pipe(writeStream);

  await new Promise((response, reject) => {
    writeStream.on("finish", () => {
      const partWithResponse = part as MultipartFileWithResponseValue;
      this.log.info("File saving done!");

      partWithResponse.value = part.filename;
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
