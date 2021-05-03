import { deserialize } from "bson";
import { app } from "../app";
import {
  addTrack,
  loadTrackList,
  removeTrack,
} from "../player/player.controller";
import { playerState } from "../player/player.state";
import { getState, wsSend, wsSendAll } from "./state.controller";
import { ClientEvents } from "./WSEvents";

export async function initStateRoute() {
  app.get("/api/ws", { websocket: true }, async ({ socket }) => {
    wsSend(socket, {
      name: "playlist",
      data: await loadTrackList(),
    });
    wsSend(socket, getState());

    socket.on("message", (body) => {
      const event = deserialize(body as NodeJS.TypedArray) as ClientEvents;
      if (event.name === "addTrack") {
        addTrack(event);
      }
      if (event.name === "setTrack") {
        playerState.change(event.data);
        playerState.afterChange();
        wsSendAll(getState());
      }
      if (event.name === "setTime") {
        playerState.setTime(event.data.time);
        playerState.change(event.data.track);
        if (!event.data.silent) {
          wsSendAll(getState());
        }
      }
      if (event.name === "togglePause") {
        playerState.togglePause();
        wsSendAll(getState());
      }
      if (event.name === "removeTrack") {
        removeTrack(event.data);
      }
    });
  });

  setInterval(() => {
    for (const client of app.websocketServer.clients.values()) {
      client.ping("ping", false, (err) => {
        if (err) {
          client.terminate();
          app.log.error(err);
        }
      });
    }
  }, 1000);
}
