import * as mkdirp from "mkdirp";
import { app } from "./app";
import { getTracksPath } from "./paths";
import { initPlayerRoutes } from "./player/player.route";
import { initSpaRoute } from "./spa/spa.route";

async function startServer() {
  await mkdirp(getTracksPath());
  await initPlayerRoutes();
  await initSpaRoute();

  try {
    const port = process.env.PORT ?? 4000;
    const host = process.env.HOST ?? "localhost";
    await app.listen(port, host);
    console.log(`Server working on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
startServer();
