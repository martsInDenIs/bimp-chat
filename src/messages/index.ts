import { FastifyPluginAsync } from "fastify";
import router from "./routes";

const messagesPlugin: FastifyPluginAsync = async (instance) => {
  instance.register(router, { prefix: "message" });
};

export default messagesPlugin;
