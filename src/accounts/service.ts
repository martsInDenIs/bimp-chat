import { PrismaClient, Prisma } from "@prisma/client";

export default class AccountsService {
  constructor(private readonly accounts: PrismaClient['account']) {}

  create(email: string, password: string) {
    return this.accounts.create({ data: { email, password } });
  }

  get(conditions: Prisma.AccountFindUniqueArgs["where"]) {
    return this.accounts.findUnique({ where: conditions });
  }
}
