import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { NextRequest, NextResponse } from "next/server";
import Innertube from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/playlists 'No query provided'");
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

  const res = await ytMusic.search(query, { type: "playlist" });
  if (!res) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let content = res.playlists?.contents;

  if (!content) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const playlists = content.map((p) => {
    const sortedThumbnails = p.thumbnail?.contents
      .sort((a, b) => b.width - a.width)
      .map((t) => t.url) || [""];

    return {
      id: p.id || "",
      name: p.title || p.flex_columns[0].title.text || "",
      thumbnail: sortedThumbnails[0],
      owner: {
        name: p.author?.name || "",
        id: p.author?.channel_id || "",
      },
      moreThumbnails: sortedThumbnails.slice(1),
    } as PlaylistMetadata;
  });

  return NextResponse.json(playlists, { status: 200 });
}
