import * as path from "path";

export function getClientPath() {
  return path.resolve(__dirname, "../client/dist");
}
export function getPublicPath() {
  return path.resolve(__dirname, "../public");
}
export function getTrackPath(track?: string) {
  return path.resolve(getPublicPath(), "tracks", track ?? "");
}
