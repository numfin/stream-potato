import { reactive, ref } from "@vue/reactivity";
import { Track } from "server/player/Track";

function usePlayer() {
  return {
    state: reactive({
      activeTrack: ref<Track>(),
    }),
    set(track: Track) {
      this.state.activeTrack = track;
    },
  };
}
export const player = usePlayer();
