import { computed, defineComponent, watch } from "@vue/runtime-core";
import { playerControl } from "../player-control/usePlayerControl";

export const Player = defineComponent({
  name: "Player",
  setup() {
    watch(
      () => playerControl.state.isPlaying,
      async (isPlaying) => {
        const { audioEl } = playerControl.state;
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
      playerControl,
      activeTrack: computed(() => playerControl.state.activeTrack),
    };
  },
  render() {
    return (
      <div>
        <span class="text-white">HELLO</span>
        {this.activeTrack && (
          <audio
            src={`/api/tracks/${this.activeTrack.id}`}
            autoplay={this.playerControl.state.isPlaying}
            ref={(el) => {
              const ael = el as HTMLMediaElement;
              playerControl.state.audioEl = ael;
              if (ael && !ael.currentTime) {
                ael.currentTime = playerControl.state.currentTime;
              }
            }}
            {...{
              volume: this.playerControl.state.volume,
            }}
            onEnded={() => this.playerControl.nextTrack()}
            onTimeupdate={(ev) => {
              const nextTime = (ev.target as HTMLMediaElement).currentTime;
              this.playerControl.state.currentTime = nextTime;
            }}
            onPlaying={() => (playerControl.state.isPlaying = true)}
            onPause={() => (playerControl.state.isPlaying = false)}
            controls
          />
        )}
      </div>
    );
  },
});
