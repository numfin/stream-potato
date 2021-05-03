import { defineComponent } from "@vue/runtime-core";
import { UploadTrack } from "./components/upload-track/UploadTrack";
import { Playlist } from "./components/playlist/Playlist";
import { Player } from "./components/player/Player";
import { ws } from "./api/ws";
import { appState } from "./app-state";

export const App = defineComponent({
  name: "App",
  setup() {
    ws.init();

    return {
      appState,
    };
  },
  render() {
    return (
      <div class="bg-gray-800 h-screen">
        <div
          class="md:grid md:grid-cols-2 overflow-auto"
          style="height: calc(100vh - 8rem)"
        >
          <div>
            <label class="px-4 mt-4 flex items-center gap-4">
              <input type="checkbox" v-model={this.appState.state.isControl} />
              <span class="text-white font-bold">Control</span>
            </label>
            <UploadTrack />
          </div>
          <Playlist />
        </div>
        <Player />
      </div>
    );
  },
});
