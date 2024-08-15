import ytdl, { videoFormat, videoInfo } from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    console.log(" INFO /data 'No id provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  if (!ytdl.validateID(id)) {
    console.log(" INFO /data 'Invalid id provided'");
    return NextResponse.json(
      { message: "Invalid id provided" },
      { status: 403 }
    );
  }

  const reqBody = await req.json();

  /*
  if (!reqBody.def_vid_thumbnail || reqBody.def_ch_thumbnail) {
    console.log(
      " INFO /data 'No default video or channel thumbnails given in request body'"
    );
    return NextResponse.json(
      {
        message: "No default video or channel thumbnails given in request body",
      },
      { status: 403 }
    );
  }
  */

  const vidInfo = await ytdl.getBasicInfo(
    `https://www.youtube.com/watch?v=${id}`
  );
  return NextResponse.json(
    {
      vid: {
        id: vidInfo.videoDetails.videoId,
        url: vidInfo.videoDetails.video_url,
        title: vidInfo.videoDetails.title,
        thumbnail: {
          main:
            vidInfo.videoDetails.thumbnails[0]?.url ||
            vidInfo.videoDetails.thumbnails[1]?.url ||
            vidInfo.videoDetails.thumbnails[2]?.url,
          alt: reqBody.def_vid_thumbnail || null,
        },
      },
      owner: {
        title: vidInfo.videoDetails.ownerChannelName,
        url: vidInfo.videoDetails.ownerProfileUrl,
        thumbnail: {
          main: vidInfo.videoDetails.author.avatar,
          alt: reqBody.def_ch_thumbnail || null,
        },
      },
      playerInfo: {
        volume: Number(reqBody.volume) || 0.5,
        loop: reqBody.loop,
        vidEnabled: reqBody.vidEnabled,
      },
    },
    { status: 200 }
  );
}
