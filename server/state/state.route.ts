import { app } from "../app";
import { playerState } from "../player/player.state";
import { Track } from "../player/Track";
import { sendState } from "./state.controller";

type StateEvents =
  | { name: "changeTrack"; data: Track }
  | { name: "togglePause" };

export async function initStateRoute() {
  app.get("/api/state", { websocket: true }, (connection) => {
    sendState(connection);

    connection.socket.on("message", (message: string) => {
      const event: StateEvents = JSON.parse(message);

      if (event.name === "changeTrack") {
        playerState.change(event.data);
      }
      if (event.name === "togglePause") {
        playerState.togglePause();
      }
      sendState(connection);
    });
  });
}
