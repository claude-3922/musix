import { ArtistData } from "@/util/types/ArtistData";
import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function POST(req: NextRequest) {
  let query: string | null = null;

  try {
    const body = await req.json();
    query = body.query;
  } catch (error) {
    console.log(" INFO /search/artists 'Invalid request body'");
    console.log(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 403 }
    );
  }

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/artists 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /search/artists 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.searchArtists(query);
  if (!res || res.length === 0) {
    console.log(" INFO /search/artists 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let artists: ArtistData[] = [];
  for (const artist of res) {
    artists.push({
      id: artist.artistId,
      name: artist.name,
      thumbnail: artist.thumbnails.sort((a, b) => b.width - a.width)[0].url,

      moreThumbnails: artist.thumbnails
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url),
    });
  }

  return NextResponse.json(artists, { status: 200 });
}
