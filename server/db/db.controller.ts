import { readFile, writeFile } from "fs/promises";
import { getPublicPath } from "../paths";
import * as path from "path";
import { DB } from "./Db";
import { app } from "../app";
import { Track } from "../player/Track";

export function useDb<DBData extends Partial<DB>>() {
  const publicPath = getPublicPath();
  const dbPath = path.resolve(publicPath, "db.json");

  async function read(): Promise<DBData | undefined> {
    try {
      const db = await readFile(dbPath, {
        encoding: "utf-8",
      });
      return JSON.parse(db) as DBData;
    } catch (err) {
      const rewrite = { tracks: [] as Track[] } as DBData;
      write(rewrite);
      return rewrite;
    }
  }

  async function write(data: DBData): Promise<void> {
    try {
      await writeFile(dbPath, JSON.stringify(data), { encoding: "utf-8" });
    } catch (err) {
      app.log.fatal(err);
    }
  }

  return {
    read,
    write,
  };
}
