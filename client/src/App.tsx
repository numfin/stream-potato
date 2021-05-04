import { defineComponent } from "@vue/runtime-core";
import { UploadTrack } from "./components/upload-track/UploadTrack";
import { Playlist } from "./components/playlist/Playlist";
import { PlayerControl } from "./components/player-control/PlayerControl";
import { ws } from "./api/ws";
import { appState } from "./app-state";
import { Player } from "./components/player/Player";

export const App = defineComponent({
  name: "App",
  setup() {
    ws.init();

    return {
      appState,
    };
  },
  render() {
    if (!appState.state.isControl) {
      return <Player />;
    }
    return (
      <div class="bg-gray-800 h-screen">
        <div
          class="md:grid md:grid-cols-2 overflow-auto"
          style="height: calc(100vh - 8rem)"
        >
          <UploadTrack />
          <Playlist />
        </div>
        <PlayerControl />
      </div>
    );
  },
});
