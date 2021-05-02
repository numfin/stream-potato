import { Track } from "./Track";

class PlayerState {
  public currentPlaying: Track | undefined;
  public isPlaying = false;

  change(track: Track) {
    this.currentPlaying = track;
    this.isPlaying = true;
  }
  togglePause() {
    this.isPlaying = !this.isPlaying;
    return this.isPlaying;
  }
}

export const playerState = new PlayerState();
