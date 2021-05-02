import { ws } from "@/api/state";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "@vue/runtime-core";
import { playlist } from "../playlist/usePlaylist";
import { NextIcon } from "./NextIcon";
import { PlayIcon } from "./PlayIcon";
import { PrevIcon } from "./PrevIcon";
import { player } from "./usePlayer";

const isNumber = (v: number) => isFinite(v) && !isNaN(v) && v;

export const Player = defineComponent({
  name: "Player",
  setup() {
    const volume = ref(localStorage.getItem("player-volume") ?? "0.5");
    const audioEl = ref<HTMLMediaElement>();

    watchEffect(() => {
      if (audioEl.value) {
        player.state.isPlaying ? audioEl.value.play() : audioEl.value.pause();
      }
    });
    const activeTrack = computed(() => player.state.activeTrack);
    watch(
      () => activeTrack.value?.id,
      (next, prev) => {
        if (next !== prev) {
          player.state.currentTime = 0;
        }
      },
    );
    const isMuted = ref(true);
    onMounted(() => {
      isMuted.value = false;
    });

    return {
      player,
      activeTrack,
      playlist,
      audioEl,
      volume: computed({
        get: () => volume.value,
        set: (v: string) => {
          volume.value = v;
          localStorage.setItem("player-volume", v);
        },
      }),
      currentTimeProgress: computed({
        get: () => {
          const progress = player.state.currentTime / player.state.duration;
          if (isNumber(progress)) {
            return progress * 100;
          }
          return 0;
        },
        set: (progress: number) => {
          if (!audioEl.value) {
            return;
          }
          if (isNumber(progress) && isNumber(player.state.duration)) {
            audioEl.value.currentTime =
              (player.state.duration * progress) / 100;
          } else {
            audioEl.value.currentTime = 0;
          }
          player.state.currentTime = audioEl.value.currentTime;
        },
      }),
      toggle: () => {
        ws.send("togglePause", null);
      },
      isMuted,
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
              value={this.currentTimeProgress}
              class="block h-8 w-full"
              onChange={(ev) => {
                const progress = (ev.target as HTMLInputElement).value;
                this.currentTimeProgress = Number(progress);
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
              onClick={() => this.playlist.prevTrack()}
            >
              <PrevIcon />
            </div>
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={this.toggle}
            >
              <PlayIcon active={!this.player.state.isPlaying} />
            </div>
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.playlist.nextTrack()}
            >
              <NextIcon />
            </div>
          </label>
        </div>

        {this.activeTrack && (
          <audio
            muted={this.isMuted}
            src={`/api/tracks/file/${this.activeTrack.id}`}
            onEnded={this.playlist.nextTrack}
            autoplay={this.player.state.isPlaying}
            ref={(el) => {
              this.audioEl = el as HTMLMediaElement;
              if (this.audioEl && !this.audioEl.currentTime) {
                this.audioEl.currentTime = this.player.state.currentTime;
              }
            }}
            {...{
              volume: this.volume,
            }}
            onDurationchange={(ev) =>
              (this.player.state.duration = (ev.target as HTMLMediaElement).duration)
            }
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
