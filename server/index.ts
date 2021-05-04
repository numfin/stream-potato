import mkdirp from "mkdirp";
import { app } from "./app";
import { getTrackPath } from "./paths";
import { initPlayerRoutes } from "./player/player.route";
import { initSpaRoute } from "./spa/spa.route";
import { initStateRoute } from "./state/state.route";
import { initYTRoute } from "./youtube/youtube.controller";

async function startServer() {
  try {
    await mkdirp(getTrackPath());
    await initPlayerRoutes();
    await initSpaRoute();
    await initStateRoute();
    await initYTRoute();

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
