import { FastifyInstance } from "fastify";
import MessagesService from "./service";

export interface MessagesInstance extends FastifyInstance {
    messagesService: MessagesService
}