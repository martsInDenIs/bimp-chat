import { Prisma, PrismaClient } from "@prisma/client";

export default class MessagesService {
  private static instance: MessagesService | null = null;
  private readonly defaultTake = 50;
  private readonly defaultOffset = 50;

  constructor(private readonly messages: PrismaClient["message"]) {
    if (MessagesService.instance) {
      return Object.assign(this, MessagesService.instance);
    }

    MessagesService.instance = this;
  }

  create(data: Prisma.MessageUncheckedCreateInput) {
    return this.messages.create({ data });
  }

  get(
    params:
      | Required<Pick<Prisma.MessageFindManyArgs, "skip" | "take">>
      | { page: number }
  ) {
    const options: Pick<Prisma.MessageFindManyArgs, "skip" | "take"> = {
      skip: 0,
      take: this.defaultTake,
    };

    if ("page" in params) {
      options["skip"] = this.defaultOffset * (params.page - 1);
    } else {
      options.skip = +params.skip;
      options.take = +params.take;
    }

    return this.messages.findMany(options);
  }

  getById(id: string) {
    return this.messages.findUnique({ where: { id } });
  }

  count() {
    return this.messages.count();
  }
}
