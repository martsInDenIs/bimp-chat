import { FastifyBasicAuthOptions } from "@fastify/basic-auth";
import { AccountsInstance } from "../types";
import { RequestWithAccount } from "./types";

const validate: FastifyBasicAuthOptions["validate"] = async function (
  username,
  password,
  req,
  reply,
  done
) {
  const instanceWithAccountService = this as AccountsInstance;

  const account = await instanceWithAccountService.accountsService.get({
    email: username,
  });

  if (!account) {
    return reply.unauthorized("Account with the given email doesn't exist!");
  }

  const isMatched = await instanceWithAccountService.bcrypt.compare(
    password,
    account?.password
  );

  if (!isMatched) {
    return reply.unauthorized('Wrong credentials!');
  }

  (req as RequestWithAccount).account = account;
  done();
};

export default validate;
