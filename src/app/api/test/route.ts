import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import Innertube, { YTNodes } from "youtubei.js";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /api/test 'No query provided'");
    return NextResponse.json({ message: "No query provided" }, { status: 403 });
  }

  const ytMusic = (
    await Innertube.create({
      retrieve_player: false,
      generate_session_locally: false,
    })
  ).music;
  if (!ytMusic) {
    console.log(" INFO /api/test 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.getUpNext(query, true);
  return NextResponse.json(
    res.contents.as(YTNodes.PlaylistPanelVideo).map((v) => {
      const sortedThumbnails = v.thumbnail
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url);
      return {
        id: v.video_id,
        url: `https://www.youtube.com/watch?v=${v.video_id}`,
        title: v.title.text || "",
        thumbnail: sortedThumbnails[0],
        duration: v.duration.seconds || 0,
        artist: {
          name: v.artists ? v.artists[0].name : "",
          id: v.artists ? v.artists[0].channel_id : "",
        },
        album: {
          name: v.album?.name || "",
          id: v.album?.id || "",
        },
        explicit:
          Boolean(
            v.badges.find(
              (b) => b.as(YTNodes.MusicInlineBadge).label === "Explicit"
            )
          ) || false,
      } as SongData;
    }),
    {
      status: 200,
    }
  );
}
