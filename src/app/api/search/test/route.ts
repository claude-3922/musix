import { AlbumData } from "@/util/types/AlbumData";
import { SongData } from "@/util/types/SongData";
import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";
import YouTube from "youtube-sr";
import Innertube, { YTNodes } from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/top 'No query provided'");
    return NextResponse.json({ message: "No query provided" }, { status: 403 });
  }

  // const res = await ytdl.getInfo(query, { limit: 1 });
  // const top = res[0];

  const ytMusic = (
    await Innertube.create({
      retrieve_player: false,
      generate_session_locally: false,
    })
  ).music;
  if (!ytMusic) {
    console.log(" INFO /search/top 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.search(query, { type: "album" });
  if (!res) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let content = res.albums?.contents;
  // if (res.has_continuation) {
  //   const continuation = await res.getContinuation();
  //   content?.concat(continuation as any);
  // }

  if (!content) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const albums = content.map((a) => {
    const sortedThumbnails = a.thumbnail?.contents
      .sort((a, b) => b.width - a.width)
      .map((t) => t.url) || [""];

    let channelId;
    if (a.artists) {
      channelId = a.artists[0].channel_id
        ? a.artists[0].channel_id
        : a.author?.channel_id || "";
    } else {
      channelId = a.author?.channel_id || "";
    }

    return {
      id: a.id || "",
      name: a.flex_columns[0].title.text || "",
      thumbnail: sortedThumbnails[0],
      artist: {
        name: a.flex_columns[1].title.runs?.flat()[2].text || "",
        id: channelId,
      },
      year: a.year || 0,
      moreThumbnails: sortedThumbnails,
      explicit:
        Boolean(
          a.badges
            ?.as(YTNodes.MusicInlineBadge)
            .find((b) => b.label === "Explicit")
        ) || false,
    } as AlbumData;
  });

  return NextResponse.json(albums, { status: 200 });
}
