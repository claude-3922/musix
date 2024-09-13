import { NextRequest, NextResponse } from "next/server";

import ytdl from "@distube/ytdl-core";
import { getAccentColors } from "@/util/colors";

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

  const vidInfo = await ytdl.getBasicInfo(
    `https://www.youtube.com/watch?v=${id}`
  );

  const colors = await getAccentColors(vidInfo.videoDetails.videoId);

  return NextResponse.json(
    {
      vid: {
        id: vidInfo.videoDetails.videoId,
        url: vidInfo.videoDetails.video_url,
        title: vidInfo.videoDetails.title,
        thumbnail:
          vidInfo.videoDetails.thumbnails[
            vidInfo.videoDetails.thumbnails.length - 1
          ].url || "/def_vid_thumbnail.jpg",

        duration: Number(vidInfo.videoDetails.lengthSeconds),
      },
      owner: {
        title: vidInfo.videoDetails.ownerChannelName,
        url: vidInfo.videoDetails.ownerProfileUrl,
        thumbnail:
          vidInfo.videoDetails.thumbnails[
            vidInfo.videoDetails.thumbnails.length - 1
          ].url || "/def_user_thumbnail.jpg",
      },
      playerInfo: {
        accentColors: colors?.colors,
        topColor: colors?.topColor,
      },
    },
    { status: 200 }
  );
}
