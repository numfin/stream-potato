import fastify from "fastify";
import fastifyMultipart from "fastify-multipart";
import fastifyStatic from "fastify-static";
import fastifyWebsocket from "fastify-websocket";
import { getClientPath } from "./paths";

export const app = fastify({ logger: { prettyPrint: true } });

app.register(fastifyStatic, {
  root: getClientPath(),
  prefix: "/",
});
app.register(fastifyMultipart);
app.register(fastifyWebsocket);
