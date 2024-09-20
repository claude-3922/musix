import { ArtistData } from "@/util/types/ArtistData";
import { NextRequest, NextResponse } from "next/server";
import Innertube from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/artists 'No query provided'");
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

  const res = await ytMusic.search(query, { type: "artist" });
  if (!res) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let content = res.artists?.contents;
  if (!content) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const artists = content.map((a) => {
    const sortedThumbnails = a.thumbnail?.contents
      .sort((a, b) => b.width - a.width)
      .map((t) => t.url) || [""];

    return {
      id: a.id || "",
      name: a.name || a.flex_columns[0].title.text || "",
      thumbnail: sortedThumbnails[0] || "",
      moreThumbnails: sortedThumbnails,
    } as ArtistData;
  });

  return NextResponse.json(artists, { status: 200 });
}
