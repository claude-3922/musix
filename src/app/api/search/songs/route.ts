import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import Innertube, { YTNodes } from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/songs 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

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

  const res = await ytMusic.search(query, { type: "song" });
  if (!res) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let content = res.songs?.contents;

  if (!content) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const songs = content.map((s) => {
    const sortedThumbnails = s.thumbnail?.contents
      .sort((a, b) => b.width - a.width)
      .map((t) => t.url) || [""];

    return {
      id: s.id || "",
      url: `https://www.youtube.com/watch?v=${s.id || ""}`,
      title: s.title || "",
      thumbnail: sortedThumbnails[0],
      duration: s.duration?.seconds || 0,
      artist: {
        name: s.flex_columns[1].title.runs?.flat()[0].text || "",
        id: s.flex_columns[1].title.endpoint?.payload.browseId || "",
      },
      album: {
        name: s.album ? s.album.name || "" : "",
        id: s.album ? s.album.id || "" : "",
        year: s.year,
      },
      moreThumbnails: sortedThumbnails,
      explicit:
        Boolean(
          s.badges
            ?.as(YTNodes.MusicInlineBadge)
            .find((b) => b.label === "Explicit")
        ) || false,
    } as SongData;
  });

  return NextResponse.json(songs, { status: 200 });
}
