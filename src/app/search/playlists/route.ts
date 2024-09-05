import { NextRequest, NextResponse } from "next/server";
import Youtube from "youtube-sr";

import { durationSeconds } from "@/util/format";

import { SongData } from "@/util/types/SongData";
import { sortSongDurations } from "@/util/sort";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";

export async function POST(req: NextRequest) {
  let query: string | null = null;
  let count = 5;

  try {
    const body = await req.json();
    query = body.query;
    count = body.count;
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

  const res = await Youtube.search(query, {
    limit: count,
    safeSearch: true,
    type: "playlist",
  });

  if (!res) {
    console.log("INFO /search/playlists 'No playlists found'");
    return NextResponse.json(
      { message: "No playlists found" },
      { status: 404 }
    );
  }

  const playlistArray: PlaylistMetadata[] = res.slice(0, count).map((p) => ({
    title: p.title ?? "NOT_FOUND",
    url: p.url ?? "NOT_FOUND",
    id: p.id ?? "NOT_FOUND",
    thumbnail: p.thumbnail?.url ?? "def_vid_thumbnail.jpg",
    owner: {
      title: p.channel?.name,
      url: p.channel?.url,
    },
  }));

  return NextResponse.json(
    {
      data: playlistArray,
    },
    { status: 200 }
  );
}
