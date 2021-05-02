import { Track } from "./Track";
import { useDb } from "../db/db.controller";
import { MultipartFile } from "fastify-multipart";
import * as cuid from "cuid";
import { pipeline } from "stream";
import { promisify } from "util";
import { unlink } from "fs/promises";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { getTracksPath } from "../paths";
import { app } from "../app";
import { DB } from "../db/Db";
const pump = promisify(pipeline);

export async function loadTrackList(): Promise<Track[]> {
  const dbData = await useDb().read();
  return dbData?.tracks ?? [];
}

export async function getTrack(id: string): Promise<Track | undefined> {
  const db = useDb();
  const dbData = await db.read();
  return dbData?.tracks?.find((track) => track.id === id);
}

export async function removeTrack(id: string): Promise<void> {
  const db = useDb();
  const dbData = (await db.read()) as DB;
  dbData.tracks = dbData?.tracks.filter((track) => track.id !== id);
  await unlink(resolve(getTracksPath(), id));
  await db.write(dbData);
}

export async function addTrack(data: MultipartFile): Promise<void> {
  const title = (data.fields.title as any).value;
  const id = cuid();
  const filePath = resolve(getTracksPath(), id);
  await pump(data.file, createWriteStream(filePath));

  const db = useDb();
  const dbData = await db.read();
  if (dbData) {
    dbData?.tracks?.push({ title, id, previewUrl: "", mime: data.mimetype });
    await db.write(dbData);
  } else {
    await unlink(filePath).catch((err) => app.log.fatal(err));
    throw new Error("Unable to write track");
  }
}
