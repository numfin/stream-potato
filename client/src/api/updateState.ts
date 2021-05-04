import { playerControl } from "@/components/player-control/usePlayerControl";
import { PlayerState } from "server/player/player.state";

export function updateState(state: PlayerState["state"]) {
  playerControl.state.activeTrack = state.track;
  playerControl.state.isPlaying = state.isPlaying;
  playerControl.state.currentTime = state.currentTime;
  playerControl.state.currentServerTime = state.currentTime;
}
