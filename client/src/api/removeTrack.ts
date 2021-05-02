import axios from "axios";
import { Track } from "server/player/Track";

export async function removeTrack(track: Track): Promise<void> {
  try {
    await axios.delete(`/api/tracks/${track.id}`);
  } catch (err) {}
}
