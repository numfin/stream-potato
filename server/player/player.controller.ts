import { Track } from "./Track";
import { useDb } from "../db/db.controller";
import * as cuid from "cuid";
import { unlink, writeFile } from "fs/promises";
import { getFileDuration } from "../ffmpeg/getFileDuration";
import { app } from "../app";
import { DB } from "../db/Db";
import { ClientEvents } from "../state/WSEvents";
import { sendPlaylist } from "../state/state.controller";
import { getTrackPath } from "../paths";

export async function loadTrackList(): Promise<Track[]> {
  const dbData = await useDb().read();
  return dbData?.tracks ?? [];
}

export async function getTrack(id: string): Promise<Track | undefined> {
  const db = useDb();
  const dbData = await db.read();
  return dbData?.tracks?.find((track) => track.id === id);
}

export async function removeTrack({ id }: Track): Promise<void> {
  const db = useDb();
  const dbData = (await db.read()) as DB;
  dbData.tracks = dbData?.tracks.filter((track) => track.id !== id);
  await unlink(getTrackPath(id));
  await db.write(dbData);

  await sendPlaylist();
}

export async function addTrack(
  event: ClientEvents & { name: "addTrack" },
): Promise<void> {
  const id = cuid();
  const filePath = getTrackPath(id);
  try {
    await writeFile(filePath, event.data.file.buffer);
    const duration = await getFileDuration(filePath);
    const db = useDb();
    const dbData = await db.read();
    dbData.tracks?.push({
      title: event.data.info.filename,
      id,
      previewUrl: "",
      mime: event.data.info.mime,
      duration,
    });
    await db.write(dbData);
    await sendPlaylist();
  } catch (err) {
    app.log.error(err);
    await unlink(filePath).catch((err) => app.log.fatal(err));
  }
}
