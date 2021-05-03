import { serialize } from "bson";
import { app } from "../app";
import { useDb } from "../db/db.controller";
import { playerState } from "../player/player.state";
import { ServerEvents } from "./WSEvents";

export function wsSend<E extends ServerEvents>(event: E) {
  for (const client of app.websocketServer.clients.values()) {
    client.send(serialize(event));
  }
}

export function sendState() {
  wsSend({
    name: "state",
    data: playerState.state,
  });
}

export async function sendPlaylist() {
  const dbData = await useDb().read();

  wsSend({
    name: "playlist",
    data: dbData?.tracks ?? [],
  });
}
