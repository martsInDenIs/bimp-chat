import AccountsService from "./service";
import { FastifyInstanceWithTypeBoxProvider } from "../types";

export interface AccountsInstance extends FastifyInstanceWithTypeBoxProvider {
  accountsService: AccountsService;
}

export type CreateAccountBody = {
  email: string;
  password: string;
};
