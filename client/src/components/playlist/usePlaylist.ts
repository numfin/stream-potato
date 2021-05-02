import { loadPlaylist } from "@/api/loadTrackList";
import { removeTrack } from "@/api/removeTrack";
import { ws } from "@/api/state";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
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
    async load() {
      try {
        this.state.tracks = await loadPlaylist();
      } catch (err) {}
    },
    async removeTrack(track: Track) {
      await removeTrack(track);
      await this.load();
      this.nextTrack();
    },
    setTrack(track: Track) {
      ws.send("changeTrack", track);
    },
    nextTrack() {
      const { tracks } = this.state;
      const position = this.position();
      this.setTrack(tracks[position + 1] ?? tracks[0]);
    },
    prevTrack() {
      const { tracks } = this.state;
      const position = this.position();
      this.setTrack(tracks[position - 1] ?? tracks[tracks.length - 1]);
    },
  };
}
export const playlist = usePlaylist();
