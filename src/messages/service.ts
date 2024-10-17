import { Prisma, PrismaClient } from "@prisma/client";

export default class MessagesService {
  constructor(private readonly messages: PrismaClient["message"]) {}

  create(data: Prisma.MessageUncheckedCreateInput) {
    return this.messages.create({ data });
  }
}
