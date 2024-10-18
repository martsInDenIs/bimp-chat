import { FastifyBasicAuthOptions } from "@fastify/basic-auth";
import { AccountsInstance } from "../types";

const validate: FastifyBasicAuthOptions["validate"] = async function (
  username,
  password,
  req,
  reply,
  done
) {
  const instanceWithAccountService = this as AccountsInstance;
  const hashedPassword = await instanceWithAccountService.bcrypt.hash(password);

  const user = await instanceWithAccountService.accountsService.get({
    email: username,
    password: hashedPassword,
  });

  if (!user) {
    return reply.unauthorized();
  }

  done();
};

export default validate;
