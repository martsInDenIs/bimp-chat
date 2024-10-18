import fastifyMultipart, { MultipartFile } from "@fastify/multipart";
import { FastifyInstance, FastifyRequest } from "fastify";
import fs from "fs";
import { MultipartFileWithResponseValue } from "./types";
import { pathToFilesFolder } from "../constants";
import { generateFileName } from "../helpers";

const onFile = async function (this: FastifyRequest, part: MultipartFile) {
  const fileName = generateFileName(part.filename);
  const writeStream = fs.createWriteStream(
    `${pathToFilesFolder}/${fileName}`
  );
  part.file.pipe(writeStream);

  await new Promise((response, reject) => {
    writeStream.on("finish", () => {
      const partWithResponse = part as MultipartFileWithResponseValue;
      this.log.info("File saving done!");

      // Pass filename to the body
      partWithResponse.value = fileName;
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
