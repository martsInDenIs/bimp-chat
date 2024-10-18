import { PrismaClient, Prisma } from "@prisma/client";

export default class AccountsService {
  private static instance: AccountsService | null = null;

  constructor(private readonly accounts: PrismaClient["account"]) {
    if (AccountsService.instance) {
      Object.assign(this, AccountsService.instance);
      return;
    }

    AccountsService.instance = this;
  }

  create(email: string, password: string) {
    return this.accounts.create({ data: { email, password } });
  }

  get(conditions: Prisma.AccountFindUniqueArgs["where"]) {
    return this.accounts.findUnique({ where: conditions });
  }
}
