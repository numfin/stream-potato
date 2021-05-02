import { defineComponent, watch } from "@vue/runtime-core";
import { playlist } from "../playlist/usePlaylist";
import { player } from "./usePlayer";

export const Player = defineComponent({
  name: "Player",
  setup() {
    watch(
      () => playlist.state.position,
      (next, from) => {
        console.log(next, from);
        if (next < 0 && from >= 0) {
          playlist.nextTrack();
        }
      },
    );

    return {
      player,
      playlist,
    };
  },
  render() {
    if (this.player.state.activeTrack) {
      return (
        <div class="fixed bottom-0 left-0 right-0 h-16 bg-gray-900">
          <div class="font-bold"></div>
          <audio
            src={`/api/tracks/file/${this.player.state.activeTrack.id}`}
            autoplay
            onEnded={this.playlist.nextTrack}
          />
        </div>
      );
    }
    return null;
  },
});
