import { defineComponent } from "@vue/runtime-core";
import { UploadTrack } from "./components/upload-track/UploadTrack";
import { Playlist } from "./components/playlist/Playlist";
import { Player } from "./components/player/Player";
import { ws } from "./api/state";

export const App = defineComponent({
  name: "App",
  setup() {
    ws.init();
  },
  render() {
    return (
      <div class="bg-gray-800 h-screen">
        <div
          class="md:grid md:grid-cols-2 overflow-auto"
          style="height: calc(100vh - 8rem)"
        >
          <UploadTrack />
          <Playlist />
        </div>
        <Player />
      </div>
    );
  },
});
