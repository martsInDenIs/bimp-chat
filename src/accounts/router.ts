import { FastifyInstance, FastifyPluginAsync } from "fastify";
import AccountsService from "./service";
import { AccountsInstance } from "./types";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { accountRegisterSchema } from "./schemas";

const router: FastifyPluginAsync = async (instance: FastifyInstance) => {
  instance.decorate(
    "accountsService",
    new AccountsService(instance.database.account)
  );

  const accountsInstance =
    instance.withTypeProvider<TypeBoxTypeProvider>() as AccountsInstance;

  accountsInstance.post(
    "/register",
    { schema: accountRegisterSchema },
    async (req, rep) => {
      const { email, password } = req.body;

      const hashedPassword = await instance.bcrypt.hash(password);

      try {
        await accountsInstance.accountsService.create(email, hashedPassword);
        return rep.created(btoa(`${email}:${password}`));
      } catch (err) {
        return rep.conflict();
      }
    }
  );
};

export default router;
