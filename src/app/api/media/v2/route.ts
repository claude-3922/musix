import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";
import Innertube, { UniversalCache } from "youtubei.js";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const vidParam = req.nextUrl.searchParams.has("vid");

  if (!id) {
    console.log(" INFO /api/media 'No id provided'");
    return Response.json({ message: "No id provided" }, { status: 400 });
  }

  const ytClient = await Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
  });

  if (!ytdl.validateID(id)) {
    console.log(" INFO /api/media 'Invalid id provided'");
    return Response.json({ message: "Invalid id provided" }, { status: 400 });
  }

  const videoInfo = await ytClient.getBasicInfo(id);
  const format = videoInfo.chooseFormat({
    type: vidParam ? "video+audio" : "audio",
    quality: "best",
    format: "any",
  });

  const fileSize = format.content_length;
  if (!fileSize) {
    console.log(" INFO /api/media 'Couldn't find format'");
    return Response.json({ message: "Couldn't find format" }, { status: 404 });
  }

  if (req.headers.get("range")) {
    const parts = req.headers
      .get("range")
      ?.replace(/bytes=/, "")
      .split("-");
    if (parts) {
      const start = parseInt(parts[0]);
      const end = parts[1] ? parseInt(parts[1]) : fileSize - 1;
      const chunksize = end - start + 1;

      const vidStream = await ytClient.download(id, {
        type: vidParam ? "video+audio" : "audio",
        quality: vidParam ? "bestefficiency" : "best",
        format: "any",

        range: {
          start: start,
          end: end,
        },
      });

      const res = new NextResponse(vidStream, { status: 206 });

      res.headers.set(`Content-Range`, `bytes ${start}-${end}/${fileSize}`);
      res.headers.set("Accept-Ranges", "bytes");
      res.headers.set(`Content-Length`, `${chunksize}`);
      res.headers.set(`Content-Type`, `${format.mime_type}`);

      return res;
    }
  } else {
    const vidStream = await ytClient.download(id, {
      type: vidParam ? "video+audio" : "audio",
      quality: vidParam ? "bestefficiency" : "best",
      format: "any",
    });

    const res = new NextResponse(vidStream, { status: 200 });

    res.headers.set(`Content-Length`, `${fileSize}`);
    res.headers.set(`Content-Type`, `${format.mime_type}`);

    return res;
  }
}
