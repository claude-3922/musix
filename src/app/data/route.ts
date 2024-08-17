import { NextRequest, NextResponse } from "next/server";

import ytdl, { videoInfo } from "@distube/ytdl-core";
import getPixels from "get-pixels";
import { extractColors } from "extract-colors";

async function getAccentColors(vidInfo: videoInfo) {
  try {
    const pixels: any = await new Promise<any>((resolve, reject) => {
      getPixels(
        `https://img.youtube.com/vi/${vidInfo.videoDetails.videoId}/maxresdefault.jpg`,
        (err, pixels) => {
          if (err) {
            reject(err);
          } else {
            resolve(pixels);
          }
        }
      );
    });

    const data = Array.from(pixels.data) as any;
    const [width, height] = pixels.shape;

    const colors = await extractColors({ data, width, height });

    let accentColors = [] as any;
    colors.forEach((color) => {
      accentColors.push(color.hex);
    });

    if (accentColors.length > 0) {
      const topColor = accentColors[0];
      return { pallete: accentColors, topC: topColor };
    }
  } catch (err) {
    console.log(err);
  }
}

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

  const data = await getAccentColors(vidInfo);
  const pallete = data?.pallete;
  const topC = data?.topC;

  return NextResponse.json(
    {
      vid: {
        id: vidInfo.videoDetails.videoId,
        url: vidInfo.videoDetails.video_url,
        title: vidInfo.videoDetails.title,
        thumbnail: {
          main: `https://img.youtube.com/vi/${vidInfo.videoDetails.videoId}/maxresdefault.jpg`,
          alt: reqBody.def_vid_thumbnail,
        },
        duration: Number(vidInfo.videoDetails.lengthSeconds),
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
        accentColors: pallete,
        topColor: topC,
      },
    },
    { status: 200 }
  );
}
