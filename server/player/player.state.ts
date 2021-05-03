import { writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { resolve } from "path";
import { getPublicPath } from "../paths";
import { Track } from "./Track";

const playerStatePath = () => resolve(getPublicPath(), "player-state.json");

export class PlayerState {
  private currentPlaying: Track | undefined;
  private isPlaying = false;
  private currentTime = 0;

  constructor() {
    try {
      const cached = readFileSync(playerStatePath(), {
        encoding: "utf-8",
      }).toString();
      const parsed = JSON.parse(cached) as PlayerState["state"];
      this.currentPlaying = parsed.track;
      this.isPlaying = parsed.isPlaying;
      this.currentTime = parsed.currentTime;
    } catch (err) {}
  }

  public get state() {
    const state = {
      track: this.currentPlaying,
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
    };
    writeFile(playerStatePath(), JSON.stringify(state));
    return state;
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
