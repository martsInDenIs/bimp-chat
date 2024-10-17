import { FastifyInstance } from "fastify";
import AccountsService from "./service";

export interface AccountsInstance extends FastifyInstance {
  accountsService: AccountsService;
}

export type CreateAccountBody = {
  email: string;
  password: string;
};
