import { readFile } from "fs/promises";
import { resolve } from "path";
import { app } from "../app";
import { getClientPath } from "../paths";

export async function initSpaRoute() {
  const indexHtmlPath = resolve(getClientPath(), "index.html");
  const page = await readFile(indexHtmlPath)
    .then((f) => f.toString())
    .catch((err) => {
      app.log.error(err);
      return "";
    });

  app.get("/", async (_, reply) => {
    return reply.type("text/html").send(page);
  });
}
