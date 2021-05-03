import { Binary } from "bson";
import { Track } from "../player/Track";
import { PlayerState } from "../player/player.state";

export type ServerEvents =
  | {
      name: "state";
      data: PlayerState["state"];
    }
  | { name: "playlist"; data: Track[] };

export type ClientEvents =
  | {
      name: "addTrack";
      data: { info: { filename: string; mime: string }; file: Binary };
    }
  | { name: "setTrack"; data: Track }
  | { name: "setTime"; data: { track: Track; time: number; silent?: boolean } }
  | { name: "removeTrack"; data: Track }
  | { name: "togglePause"; data: null };
