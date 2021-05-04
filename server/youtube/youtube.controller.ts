import ytpl from "ytpl";
import ytdl, { chooseFormat } from "ytdl-core";
import { app } from "../app";
import { addTrack } from "../player/player.controller";
import { Binary } from "bson";

export async function downloadYoutube(link: string) {
  try {
    const url = new URL(link);
    if (url.host !== "www.youtube.com") {
      return;
    }
    const info = await ytdl.getInfo(link);
    const filename = info.videoDetails.title;
    const format = chooseFormat(info.formats, { quality: "highestaudio" });
    const mime = format.mimeType?.split(";")[0] ?? "";

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const buf: Uint8Array[] = [];
      const stream = ytdl(link, { quality: "highestaudio" });
      stream.on("data", (chunk) => buf.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(buf)));
      stream.on("error", (err) => reject(err));
    });
    await addTrack({
      name: "addTrack",
      data: {
        file: new Binary(buffer),
        info: {
          filename,
          mime,
        },
      },
    });
  } catch (err) {}
}

async function linkToUrls(link: string) {
  const url = new URL(link);
  if (url.host !== "www.youtube.com") {
    return [];
  }
  if (url.searchParams.has("list")) {
    const { items } = await ytpl(url.searchParams.get("list")!, {
      limit: 1000,
    });

    return items.map(({ shortUrl }) => shortUrl).filter(Boolean);
  } else if (url.searchParams.has("v")) {
    await ytdl.getBasicInfo(url.searchParams.get("v")!);
    return [link];
  }
}

/* returns array of valid video urls */
export async function initYTRoute() {
  app.get("/api/yt", async ({ query }) => {
    const { link } = query as { link: string };
    try {
      return await linkToUrls(link);
    } catch (err) {
      return [];
    }
  });
}
