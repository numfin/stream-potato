import { computed, defineComponent } from "@vue/runtime-core";
import { playlist } from "../playlist/usePlaylist";
import { NextIcon } from "./NextIcon";
import { PlayIcon } from "./PlayIcon";
import { PrevIcon } from "./PrevIcon";
import { playerControl } from "./usePlayerControl";

export const PlayerControl = defineComponent({
  name: "PlayerControl",
  setup() {
    return {
      playerControl,
      playlist,
      progress: computed(() => {
        const duration = playerControl.state.activeTrack?.duration ?? 0;
        return (playerControl.state.currentTime * 100) / duration;
      }),
    };
  },
  render() {
    return (
      <div class="fixed bottom-0 left-0 right-0 h-32 bg-gray-900">
        <div class="grid grid-cols-8 grid-rows-5 gap-x-4 h-full items-center px-10">
          <label class="col-span-8 row-start-1 row-end-4">
            <div class="text-white">
              {this.playerControl.state.activeTrack?.title ?? "Not Playing"}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={this.progress}
              class="block h-8 w-full"
              onInput={(ev) => {
                const progress = (ev.target as HTMLInputElement).value;
                playerControl.updateCurrentTime(Number(progress));
              }}
            />
          </label>
          {/* <label class="col-span-2 row-start-1 row-end-4">
            <div class="text-white">Volume:</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model={this.playerControl.state.volume}
              class="block h-8 w-full"
            />
          </label> */}
          <label
            class="col-span-8 row-start-4 row-end-5 justify-center flex gap-4"
            v-show={this.playerControl.state.activeTrack}
          >
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.playerControl.prevTrack()}
            >
              <PrevIcon />
            </div>
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.playerControl.togglePause()}
            >
              <PlayIcon active={!this.playerControl.state.isPlaying} />
            </div>
            <div
              class="w-8 h-8 bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
              onClick={() => this.playerControl.nextTrack()}
            >
              <NextIcon />
            </div>
          </label>
        </div>
      </div>
    );
  },
});
