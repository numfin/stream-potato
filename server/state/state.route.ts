import { deserialize } from "bson";
import { app } from "../app";
import { addTrack, removeTrack } from "../player/player.controller";
import { playerState } from "../player/player.state";
import { sendPlaylist, sendState } from "./state.controller";
import { ClientEvents } from "./WSEvents";

export async function initStateRoute() {
  app.get("/api/ws", { websocket: true }, (connection) => {
    sendPlaylist();
    sendState();

    connection.socket.on("message", (body) => {
      const event = deserialize(body as NodeJS.TypedArray) as ClientEvents;
      if (event.name === "addTrack") {
        addTrack(event);
      }
      if (event.name === "setTrack") {
        playerState.change(event.data);
        playerState.afterChange();
      }
      if (event.name === "setTime") {
        playerState.setTime(event.data.time);
        playerState.change(event.data.track);
        if (event.data.silent) {
          return;
        }
      }
      if (event.name === "togglePause") {
        playerState.togglePause();
      }
      if (event.name === "removeTrack") {
        removeTrack(event.data);
      }
      sendState();
    });
  });
}
