import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function POST(req: NextRequest) {
  let query: string | null = null;

  try {
    const body = await req.json();
    query = body.query;
  } catch (error) {
    console.log(" INFO /search/songs 'Invalid request body'");
    console.log(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 403 }
    );
  }

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/songs 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /search/songs 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.searchSongs(query);
  if (!res || res.length === 0) {
    console.log(" INFO /search/songs 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let songs: SongData[] = [];
  for (const song of res) {
    songs.push({
      id: song.videoId,
      url: `https://www.youtube.com/watch?v=${song.videoId}`,
      title: song.name,
      thumbnail: song.thumbnails.sort((a, b) => b.width - a.width)[0].url,
      duration: song.duration || 0,
      artist: {
        name: song.artist.name,
        id: song.artist.artistId || "Unknown",
      },
      album: {
        name: song.album ? song.album.name : "Unknown",
        id: song.album ? song.album.albumId : "Unknown",
      },
      moreThumbnails: song.thumbnails
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url),
    });
  }

  return NextResponse.json(songs, { status: 200 });
}
