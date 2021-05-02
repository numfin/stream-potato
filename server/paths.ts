import * as path from "path";

export function getClientPath() {
  return path.resolve(__dirname, "../client/dist");
}
export function getPublicPath() {
  return path.resolve(__dirname, "../public");
}
export function getTracksPath() {
  return path.resolve(getPublicPath(), "tracks");
}
