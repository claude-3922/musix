import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const mediaTypeParam = req.nextUrl.searchParams.has("vid");

  if (!id) {
    console.log(" INFO /media 'No id provided'");
    return Response.json({ message: "No id provided" }, { status: 403 });
  }

  if (!ytdl.validateID(id)) {
    console.log(" INFO /media 'Invalid id provided'");
    return Response.json({ message: "Invalid id provided" }, { status: 403 });
  }

  const vidInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);

  let format;

  if (!mediaTypeParam) {
    format = ytdl.chooseFormat(vidInfo.formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });
  } else {
    format = ytdl.chooseFormat(vidInfo.formats, {
      filter: (format) =>
        !format.hasAudio && format.hasVideo && format.quality === "hd720",
    });
  }

  if (!format) {
    console.log(" INFO /media 'Error while choosing format'");
    return Response.json(
      { message: "Error while choosing format" },
      { status: 500 }
    );
  }

  const fileSize = Number(format?.contentLength);

  if (req.headers.get("range")) {
    const parts = req.headers
      .get("range")
      ?.replace(/bytes=/, "")
      .split("-");
    if (parts) {
      const start = parseInt(parts[0]);
      const end = parts[1] ? parseInt(parts[1]) : fileSize - 1;
      const chunksize = end - start + 1;

      const readableStream = ytdl.downloadFromInfo(vidInfo, {
        range: { start: start, end: end },
        dlChunkSize: chunksize,
        format: format,
      });

      readableStream.on("error", (err) =>
        console.log(`ERROR /api/media ${err}`)
      );

      const res = new NextResponse(readableStream as any, { status: 206 });

      res.headers.set(`Content-Range`, `bytes ${start}-${end}/${fileSize}`);
      res.headers.set("Accept-Ranges", "bytes");
      res.headers.set(`Content-Length`, `${chunksize}`);
      res.headers.set(`Content-Type`, `${format.mimeType}`);

      return res;
    }
  } else {
    const readableStream = ytdl.downloadFromInfo(vidInfo, { format: format });

    const res = new NextResponse(readableStream as any, { status: 200 });

    res.headers.set(`Content-Length`, `${fileSize}`);
    res.headers.set(`Content-Type`, `${format.mimeType}`);

    return res;
  }
}
