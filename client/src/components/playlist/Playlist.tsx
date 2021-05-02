import { computed, defineComponent, ref } from "@vue/runtime-core";
import { withModifiers } from "@vue/runtime-dom";
import { player } from "../player/usePlayer";
import { RemoveIcon } from "./RemoveIcon";
import { playlist } from "./usePlaylist";
import Fuse from "fuse.js";
import { Track } from "server/player/Track";

export const Playlist = defineComponent({
  name: "Playlist",
  setup() {
    playlist.load();

    const searchList = computed(
      () =>
        new Fuse(playlist.state.tracks, {
          keys: ["title"],
        }),
    );
    const searchString = ref("");

    return {
      playlist,
      player: player,
      searchString,
      tracks: computed(() => {
        if (searchString.value.length > 0) {
          return searchList.value.search(searchString.value);
        }
        return playlist.state.tracks.map(
          (track) =>
            ({
              item: track,
            } as Fuse.FuseResult<Track>),
        );
      }),
    };
  },
  render() {
    return (
      <div class="space-y-1 bg-gray-700 p-2 h-full overflow-y-scroll">
        <input
          type="text"
          placeholder="Search..."
          class="py-2 px-4 w-full"
          v-model={this.searchString}
        />

        {this.tracks.map(({ item: track }) => {
          return (
            <div
              class="px-4 py-2 cursor-pointer bg-gray-900 text-gray-200 hover:bg-gray-800 flex items-center justify-between"
              onClick={() => this.playlist.setTrack(track)}
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
