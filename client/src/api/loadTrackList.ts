import axios from "axios";
import { Track } from "server/player/Track";

export async function loadPlaylist(): Promise<Track[]> {
  try {
    const tracks = await axios.get<Track[]>("/api/tracks");
    return tracks.data;
  } catch (err) {
    return [];
  }
}
