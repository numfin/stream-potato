import { defineComponent } from "@vue/runtime-core";
import { withModifiers } from "@vue/runtime-dom";
import { player } from "../player/usePlayer";
import { RemoveIcon } from "./RemoveIcon";
import { playlist } from "./usePlaylist";

export const Playlist = defineComponent({
  name: "Playlist",
  setup() {
    playlist.load();

    return {
      playlist,
      player: player,
    };
  },
  render() {
    return (
      <div class="space-y-1 bg-gray-700 p-2 h-full overflow-y-scroll">
        {this.playlist.state.tracks.map((track) => {
          return (
            <div
              class="px-4 py-2 cursor-pointer bg-gray-900 text-gray-200 hover:bg-gray-800 flex items-center justify-between"
              onClick={() => this.player.set(track)}
            >
              <span>{`${track.title}`}</span>
              <div
                class="border border-white px-2 py-1 inline-block hover:bg-white text-white hover:text-gray-800"
                onClick={withModifiers(() => this.playlist.removeTrack(track), [
                  "stop",
                ])}
              >
                <RemoveIcon />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});
