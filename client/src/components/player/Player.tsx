import { appState } from "@/app-state";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "@vue/runtime-core";
import { playlist } from "../playlist/usePlaylist";
import { NextIcon } from "./NextIcon";
import { PlayIcon } from "./PlayIcon";
import { PrevIcon } from "./PrevIcon";
import { player } from "./usePlayer";

export const Player = defineComponent({
  name: "Player",
  setup() {
    const volume = ref(localStorage.getItem("player-volume") ?? "1");

    watch(
      () => player.state.isPlaying,
      async (isPlaying) => {
        console.log(isPlaying);
        const { audioEl } = player.state;
        if (audioEl && audioEl.paused !== !isPlaying) {
          try {
            isPlaying ? await audioEl?.play() : audioEl?.pause();
          } catch (err) {
            console.log(err);
          }
        }
      },
    );
    return {
      player,
      activeTrack: computed(() => player.state.activeTrack),
      playlist,
      volume: computed({
        get: () => volume.value,
        set: (v: string) => {
          volume.value = v;
          localStorage.setItem("player-volume", v);
        },
      }),
    };
  },
  render() {
    return (
      <div class="fixed bottom-0 left-0 right-0 h-32 bg-gray-900">
        <div class="grid grid-cols-8 grid-rows-5 gap-x-4 h-full items-center px-10">
          <label class="col-span-6 row-start-1 row-end-4">
            <div class="text-white">
              {this.activeTrack?.title ?? "Not Playing"}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={this.player.state.currentServerTime}
              class="block h-8 w-full"
              onChange={(ev) => {
                const progress = (ev.target as HTMLInputElement).value;
                player.updateCurrentTime(Number(progress));
              }}
            />
          </label>
          <label class="col-span-2 row-start-1 row-end-4">
            <div class="text-white">Volume:</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model={this.volume}
              class="block h-8 w-full"
            />
          </label>
          <label
            class="col-span-8 row-start-4 row-end-5 justify-center flex gap-4"
            v-show={this.activeTrack}
          >
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.player.prevTrack()}
            >
              <PrevIcon />
            </div>
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.player.togglePause()}
            >
              <PlayIcon active={!this.player.state.isPlaying} />
            </div>
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.player.nextTrack()}
            >
              <NextIcon />
            </div>
          </label>
        </div>

        {this.activeTrack && (
          <audio
            src={`/api/tracks/${this.activeTrack.id}`}
            onEnded={() => {
              this.player.nextTrack();
            }}
            autoplay={this.player.state.isPlaying}
            ref={(el) => {
              const ael = el as HTMLMediaElement;
              player.state.audioEl = ael;
              if (ael && !ael.currentTime) {
                ael.currentTime = player.state.currentTime;
              }
            }}
            {...{
              volume: this.volume,
            }}
            onTimeupdate={(ev) => {
              const nextTime = (ev.target as HTMLMediaElement).currentTime;
              if (nextTime - this.player.state.currentTime > 1) {
                this.player.state.currentTime = nextTime;
              }
            }}
            onPlaying={() => (player.state.isPlaying = true)}
            onPause={() => (player.state.isPlaying = false)}
          />
        )}
      </div>
    );
  },
});
