import { player } from "@/components/player/usePlayer";
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { ServerState } from "server/state/state.controller";

const host = `ws://${location.host}/api/state`;

interface WSEvent {
  name: string;
  data: unknown;
}

function useWS() {
  let client: WebSocket;

  const pendingMessages = ref<WSEvent[]>([]);
  const wsState = ref(WebSocket.CLOSED);

  function init() {
    client = new WebSocket(host);
    let stopWatching = watchEffect(() => {
      if (
        wsState.value === WebSocket.OPEN &&
        pendingMessages.value.length > 0
      ) {
        pendingMessages.value.forEach((v) => client.send(JSON.stringify(v)));
        pendingMessages.value.splice(0, pendingMessages.value.length);
      }
    });

    client.onopen = () => {
      wsState.value = WebSocket.OPEN;
    };
    client.onclose = () => {
      stopWatching();
      wsState.value = WebSocket.CLOSED;
      client.close();
      setTimeout(init, 500);
    };
    client.onmessage = (ev) => {
      const event: WSEvent = JSON.parse(ev.data);
      if (event.name === "state") {
        const state = event.data as ServerState;
        player.state.isPlaying = state.isPlaying;
        player.state.activeTrack = state.track;
      }
    };
  }

  return {
    init,
    send(name: string, data: unknown) {
      pendingMessages.value.push({
        name,
        data,
      });
    },
  };
}
export const ws = useWS();
