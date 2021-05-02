import { Track } from "../player/Track";

export interface ServerState {
  track: Track;
  isPlaying: boolean;
}
