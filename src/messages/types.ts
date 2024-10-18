import { FastifyInstance } from "fastify";
import MessagesService from "./service";
import { FastifyInstanceWithTypeBoxProvider } from "../types";

export interface MessagesInstance extends FastifyInstanceWithTypeBoxProvider {
    messagesService: MessagesService
}