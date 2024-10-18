import { MultipartFile } from "@fastify/multipart";

export type MultipartFileWithResponseValue = MultipartFile & { value: any };
