import { ws } from "@/api/ws";
import { appState } from "@/app-state";
import { isNumber } from "@/helpers/isNumber";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { Track } from "server/player/Track";
import { playlist } from "../playlist/usePlaylist";

function usePlayer() {
  const currentTime = ref(0);

  const state = reactive({
    audioEl: ref<HTMLAudioElement>(),
    activeTrack: ref<Track>(),
    isPlaying: false,
    currentTime: computed({
      get: () => currentTime.value,
      set: (time: number) => {
        if (time - state.currentTime > 1 || time < state.currentTime) {
          if (state.activeTrack) {
            ws.send({
              name: "setTime",
              data: {
                track: state.activeTrack,
                time,
                silent: true,
              },
            });
          }
        }
        currentTime.value = time;
      },
    }),
    currentServerTime: computed({
      get: (): number => {
        const { activeTrack, currentTime } = state;
        if (!activeTrack) {
          return 0;
        }
        const { duration } = activeTrack;
        const progress = currentTime / duration;
        if (isNumber(progress)) {
          return progress * 100;
        }
        return 0;
      },
      set: (time: number) => {
        if (state.audioEl) {
          state.audioEl.currentTime = time;
          state.currentTime = state.audioEl.currentTime;
        }
      },
    }),
  });

  return {
    state,
    /* set track in backend */
    setTrack(track: Track) {
      if (appState.state.isControl) {
        ws.send({ name: "setTrack", data: track });
      }
    },
    nextTrack() {
      if (appState.state.isControl) {
        const { tracks } = playlist.state;
        const position = playlist.position();
        this.setTrack(tracks[position + 1] ?? tracks[0]);
      }
    },
    prevTrack() {
      if (appState.state.isControl) {
        const { tracks } = playlist.state;
        const position = playlist.position();
        this.setTrack(tracks[position - 1] ?? tracks[tracks.length - 1]);
      }
    },
    togglePause() {
      ws.send({ name: "togglePause", data: null });
    },
    progressToTime(progress: number) {
      const { audioEl, activeTrack } = state;
      if (!audioEl || !activeTrack) {
        return 0;
      }
      const { duration } = activeTrack;

      if (isNumber(progress) && isNumber(duration)) {
        return (duration * progress) / 100;
      } else {
        return 0;
      }
    },
    updateCurrentTime(progress: number) {
      if (this.state.activeTrack && appState.state.isControl) {
        ws.send({
          name: "setTime",
          data: {
            time: this.progressToTime(progress),
            track: this.state.activeTrack,
          },
        });
      }
    },
  };
}
export const player = usePlayer();
