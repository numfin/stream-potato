import { ws } from "@/api/ws";
import { appState } from "@/app-state";
import { isNumber } from "@/helpers/isNumber";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { Track } from "server/player/Track";
import { playlist } from "../playlist/usePlaylist";

function usePlayerControl() {
  const currentTime = ref(0);
  const volume = ref(localStorage.getItem("player-volume") ?? "1");

  const state = reactive({
    audioEl: ref<HTMLAudioElement>(),
    activeTrack: ref<Track>(),
    isPlaying: false,
    volume: computed({
      get: () => volume.value,
      set: (v: string) => {
        volume.value = v;
        localStorage.setItem("player-volume", v);
      },
    }),
    currentTime: computed({
      get: () => currentTime.value,
      set: (time: number) => {
        const isDelayed = time - state.currentTime > 0.2;
        const isGoingBack = time < state.currentTime;
        const canUpdateTime = state.activeTrack && !appState.state.isControl;

        if ((isDelayed || isGoingBack) && canUpdateTime) {
          ws.send({
            name: "setTime",
            data: {
              track: state.activeTrack!,
              time,
            },
          });
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
        if (state.audioEl && !appState.state.isControl) {
          state.audioEl.currentTime = time;
        }
      },
    }),
  });

  return {
    state,
    /* set track in backend */
    setTrack(track: Track) {
      ws.send({ name: "setTrack", data: track });
    },
    nextTrack() {
      const { tracks } = playlist.state;
      const position = playlist.position();
      this.setTrack(tracks[position + 1] ?? tracks[0]);
    },
    prevTrack() {
      const { tracks } = playlist.state;
      const position = playlist.position();
      this.setTrack(tracks[position - 1] ?? tracks[tracks.length - 1]);
    },
    togglePause() {
      ws.send({ name: "togglePause", data: null });
    },
    progressToTime(progress: number) {
      const { activeTrack } = state;
      if (!activeTrack) {
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
      if (this.state.activeTrack) {
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
export const playerControl = usePlayerControl();
