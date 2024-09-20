import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import Innertube from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/videos 'No query provided'");
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

  const res = await ytMusic.search(query, { type: "video" });
  if (!res) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let content = res.videos?.contents;
  if (!content) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const videos = content.map((v) => {
    const sortedThumbnails = v.thumbnail?.contents
      .sort((a, b) => b.width - a.width)
      .map((t) => t.url) || [""];

    return {
      id: v.id || "",
      url: `https://www.youtube.com/watch?v=${v.id}`,
      title: v.flex_columns[0].title.text || "",
      thumbnail: sortedThumbnails[0],
      duration: v.duration?.seconds || 0,
      artist: {
        name: v.flex_columns[1].title.runs?.flat()[0].text || "",
        id: v.flex_columns[1].title.endpoint?.payload.browseId || "",
      },
      moreThumbnails: sortedThumbnails.slice(1),
    } as SongData;
  });

  return NextResponse.json(videos, { status: 200 });
}
