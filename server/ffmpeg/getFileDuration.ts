// ffprobe -i <file> -show_entries format=duration -v quiet -of csv="p=0"
import { execFile } from "child_process";
import { resolve } from "path";

function getFFProbePath() {
  return resolve(__dirname, "ffprobe");
}

const args = (path: string) => [
  "-i",
  path,
  "-show_entries",
  "format=duration",
  "-of",
  "csv=p=0",
  "-v",
  "quiet",
];

export async function getFileDuration(path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    execFile(getFFProbePath(), args(path), (err, stdout) => {
      const result = parseFloat(stdout);
      const isNumber =
        typeof result === "number" && isFinite(result) && !isNaN(result);

      if (err || !isNumber) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
