import { FastifyPluginAsync } from "fastify";
import AccountsService from "./service";
import fastifyBcrypt from "fastify-bcrypt";
import { AccountsInstance, CreateAccountBody } from "./types";

const router: FastifyPluginAsync = async (instance) => {
  instance.register(fastifyBcrypt);
  instance.decorate(
    "accountsService",
    new AccountsService(instance.database.account)
  );

  // TODO: temporal solution
  const accountsInstance = instance as AccountsInstance;
  accountsInstance.post<{ Body: CreateAccountBody }>(
    "/register",
    async (req, res) => {
      // TODO: Add schema validation
      const { email, password } = req.body;

      const hasPassword = await instance.bcrypt.hash(password);

      try {
        await accountsInstance.accountsService.create(email, hasPassword);
      } catch (err) {
        return res.status(409).send();
      }

      return res.status(201).send();
    }
  );
};

export default router;
