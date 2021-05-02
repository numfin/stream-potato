import axios from "axios";
import { AddTrack } from "server/player/Track";

export async function uploadTrack(track: AddTrack): Promise<void> {
  try {
    const body = new FormData();
    body.append("title", track.title);
    body.append("file", track.file);
    await axios.post("/api/tracks", body);
  } catch (err) {}
}
