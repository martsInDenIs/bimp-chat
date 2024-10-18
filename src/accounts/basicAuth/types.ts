import { Account } from "@prisma/client";
import { FastifyRequest } from "fastify";

export interface RequestWithAccount extends FastifyRequest {
  account: Account;
}
