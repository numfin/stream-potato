import { app } from "../app";
import { getTrack } from "./player.controller";
import { getTrackPath } from "../paths";

export async function initPlayerRoutes() {
  app.get("/api/tracks/:id", async ({ params }, reply) => {
    const id = (params as { id: string }).id;
    const trackInfo = await getTrack(id);
    if (trackInfo) {
      return reply.type(trackInfo.mime).sendFile(id, getTrackPath());
    }
    return reply.code(404).send();
  });
}
