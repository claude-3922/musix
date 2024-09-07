import { AlbumData } from "@/util/types/AlbumData";
import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function POST(req: NextRequest) {
  let query: string | null = null;

  try {
    const body = await req.json();
    query = body.query;
  } catch (error) {
    console.log(" INFO /search/albums 'Invalid request body'");
    console.log(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 403 }
    );
  }

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/albums 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /search/albums 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.searchAlbums(query);
  if (!res || res.length === 0) {
    console.log(" INFO /search/albums 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let albums: AlbumData[] = [];
  for (const album of res) {
    albums.push({
      id: album.albumId,
      name: album.name,
      thumbnail: album.thumbnails.sort((a, b) => b.width - a.width)[0].url,

      artist: {
        name: album.artist.name,
        id: album.artist.artistId || "Unknown",
      },
      moreThumbnails: album.thumbnails
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url),
      year: album.year || -1,
    });
  }

  return NextResponse.json(albums, { status: 200 });
}
