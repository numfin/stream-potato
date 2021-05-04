import { serialize } from "bson";
import WebSocket = require("ws");
import { app } from "../app";
import { playerState } from "../player/player.state";
import { ServerEvents } from "./WSEvents";

export function wsSendAll<E extends ServerEvents>(
  event: E,
  except = [] as WebSocket[],
) {
  for (const client of app.websocketServer.clients.values()) {
    if (!except.includes(client)) {
      client.send(serialize(event));
    }
  }
}
export function wsSend(client: WebSocket, event: ServerEvents) {
  client.send(serialize(event));
}

export function getState(): ServerEvents {
  return {
    name: "state",
    data: playerState.state,
  };
}
