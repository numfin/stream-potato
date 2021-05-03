import { ws } from "@/api/ws";
import { appState } from "@/app-state";
import { reactive, ref } from "@vue/reactivity";
import { Track } from "server/player/Track";
import { player } from "../player/usePlayer";

function usePlaylist() {
  const tracks = ref<Track[]>([]);

  return {
    state: reactive({
      tracks,
    }),
    position() {
      return this.state.tracks.findIndex((track) => {
        return track.id === player.state.activeTrack?.id;
      });
    },
    async removeTrack(track: Track) {
      if (appState.state.isControl) {
        ws.send({ name: "removeTrack", data: track });
      }
    },
  };
}
export const playlist = usePlaylist();
