import fastify from "fastify";
import fastifyMultipart from "fastify-multipart";
import fastifyStatic from "fastify-static";
import fastifyWebsocket from "fastify-websocket";
import { getClientPath, getPublicPath } from "./paths";

export const app = fastify({ logger: { prettyPrint: true } });

app.register(fastifyStatic, {
  root: getClientPath(),
  prefix: "/",
});
app.register(fastifyStatic, {
  root: getPublicPath(),
  prefix: "/public",
  decorateReply: false,
});
app.register(fastifyMultipart);
app.register(fastifyWebsocket);
