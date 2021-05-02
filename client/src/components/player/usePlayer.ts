import { reactive, ref } from "@vue/reactivity";
import { Track } from "server/player/Track";

function usePlayer() {
  return {
    state: reactive({
      activeTrack: ref<Track>(),
      isPlaying: ref(false),
      duration: ref(0.0),
      currentTime: ref(0),
    }),
    set(track: Track) {
      this.state.activeTrack = track;
      this.state.isPlaying = true;
    },
  };
}
export const player = usePlayer();
