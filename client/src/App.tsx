import { defineComponent } from "@vue/runtime-core";
import { UploadTrack } from "./components/upload-track/UploadTrack";
import { Playlist } from "./components/playlist/Playlist";
import { Player } from "./components/player/Player";

export const App = defineComponent({
  name: "App",
  render() {
    return (
      <div class="bg-gray-800 h-screen">
        <div class="grid grid-cols-2" style="height: calc(100vh - 4rem)">
          <UploadTrack />
          <Playlist />
        </div>
        <Player />
      </div>
    );
  },
});
