import { loadPlaylist } from "@/api/loadTrackList";
import { removeTrack } from "@/api/removeTrack";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { Track } from "server/player/Track";
import { player } from "../player/usePlayer";

function usePlaylist() {
  const tracks = ref<Track[]>([]);

  return {
    state: reactive({
      tracks,
      position: computed(() => {
        return tracks.value.findIndex((track) => {
          return track === player.state.activeTrack;
        });
      }),
    }),
    async load() {
      try {
        this.state.tracks = await loadPlaylist();
      } catch (err) {}
    },
    async removeTrack(track: Track) {
      await removeTrack(track);
      this.load();
    },
    nextTrack() {
      player.set(this.state.tracks[this.state.position + 1]);
    },
  };
}
export const playlist = usePlaylist();
