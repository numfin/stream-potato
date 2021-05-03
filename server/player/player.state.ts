import { Track } from "./Track";

export class PlayerState {
  private currentPlaying: Track | undefined;
  private isPlaying = false;
  private currentTime = 0;

  public get state() {
    return {
      track: this.currentPlaying,
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
    };
  }

  change(track: Track) {
    this.currentPlaying = track;
  }
  afterChange() {
    this.isPlaying = true;
    this.setTime(0);
  }
  setTime(time: number) {
    this.currentTime = time;
  }
  togglePause() {
    this.isPlaying = !this.isPlaying;
  }
}

export const playerState = new PlayerState();
