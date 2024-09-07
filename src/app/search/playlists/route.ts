import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function POST(req: NextRequest) {
  let query: string | null = null;

  try {
    const body = await req.json();
    query = body.query;
  } catch (error) {
    console.log(" INFO /search/playlists 'Invalid request body'");
    console.log(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 403 }
    );
  }

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/playlists 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /search/playlists 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.searchPlaylists(query);
  if (!res || res.length === 0) {
    console.log(" INFO /search/playlists 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let playlists: PlaylistMetadata[] = [];
  for (const playlist of res) {
    playlists.push({
      id: playlist.playlistId,
      name: playlist.name,
      thumbnail: playlist.thumbnails.sort((a, b) => b.width - a.width)[0].url,
      owner: {
        name: playlist.artist.name,
        id: playlist.artist.artistId || "Unknown",
      },
      moreThumbnails: playlist.thumbnails
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url),
    });
  }

  return NextResponse.json(playlists, { status: 200 });
}
