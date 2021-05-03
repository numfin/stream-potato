import { player } from "@/components/player/usePlayer";
import { PlayerState } from "server/player/player.state";

export function updateState(state: PlayerState["state"]) {
  player.state.activeTrack = state.track;
  player.state.isPlaying = state.isPlaying;
  player.state.currentTime = state.currentTime;
  player.state.currentServerTime = state.currentTime;
}
