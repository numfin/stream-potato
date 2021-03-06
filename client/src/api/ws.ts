import { playlist } from "@/components/playlist/usePlaylist";
import { blobToArrayBuffer } from "@/helpers/blobToArrayBuffer";
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { deserialize, serialize } from "bson";
import { Buffer } from "buffer";
import { ClientEvents, ServerEvents } from "server/state/WSEvents";
import { updateState } from "./updateState";

const host = `ws://localhost:4000/api/ws`;

type WSMessageEvent = ClientEvents;

const RECONNECT_TIME = 5000;
function useWS() {
  let client: WebSocket;

  const pendingMessages = ref<WSMessageEvent[]>([]);
  const wsState = ref(WebSocket.CLOSED);

  function init() {
    client = new WebSocket(host);
    let stopWatching = watchEffect(() => {
      if (wsState.value === WebSocket.OPEN) {
        if (pendingMessages.value.length > 0) {
          pendingMessages.value.forEach((v) => {
            client.send(serialize(v));
          });
          pendingMessages.value.splice(0, pendingMessages.value.length);
        }
      }
    });

    client.onopen = () => {
      wsState.value = WebSocket.OPEN;
    };
    client.onclose = () => {
      stopWatching();
      wsState.value = WebSocket.CLOSED;
      setTimeout(init, 500);
    };
    setTimeout(() => {
      if (wsState.value !== WebSocket.OPEN) {
        client.close();
      }
    }, RECONNECT_TIME);
    client.onmessage = async (ev) => {
      const buffer = Buffer.from(await blobToArrayBuffer(ev.data));
      const event = deserialize(buffer) as ServerEvents;
      if (event.name === "state") {
        updateState(event.data);
      }
      if (event.name === "playlist") {
        playlist.state.tracks = event.data;
      }
    };
  }

  return {
    init,
    send<E extends ClientEvents>(message: E) {
      pendingMessages.value.push(message as E);
    },
  };
}
export const ws = useWS();
