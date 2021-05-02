import { app } from "../app";
import {
  addTrack,
  getTrack,
  loadTrackList,
  removeTrack,
} from "./player.controller";
import { getTracksPath } from "../paths";

export async function initPlayerRoutes() {
  const tracksPath = getTracksPath();

  /* list of all tracks */
  app.get("/api/tracks", async () => loadTrackList());

  /* add new track */
  app.post("/api/tracks", async (req, reply) => {
    await addTrack(await req.file());
    return reply.code(201).send();
  });

  /* get track info by id */
  app.get("/api/tracks/:id", async ({ params }, reply) => {
    const id = (params as { id: string }).id;
    return getTrack(id) ?? reply.code(404).send();
  });

  /* get track file by id */
  app.get("/api/tracks/file/:id", async ({ params }, reply) => {
    const id = (params as { id: string }).id;
    const trackInfo = await getTrack(id);
    if (trackInfo) {
      return reply.type(trackInfo.mime).sendFile(id, tracksPath);
    }
    return reply.code(404).send();
  });

  /* delete by id */
  app.delete("/api/tracks/:id", async ({ params }, reply) => {
    const id = (params as { id: string }).id;
    await removeTrack(id);
    return reply.code(202).send();
  });
}
