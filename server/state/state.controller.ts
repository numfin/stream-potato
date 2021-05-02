import { SocketStream } from "fastify-websocket";
import { playerState } from "../player/player.state";
import { Track } from "../player/Track";

export interface ServerState {
  track: Track;
  isPlaying: boolean;
}

export function sendState(connection: SocketStream) {
  connection.socket.send(
    JSON.stringify({
      name: "state",
      data: {
        track: playerState.currentPlaying,
        isPlaying: playerState.isPlaying,
      } as ServerState,
    }),
  );
}
