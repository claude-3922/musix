import { LyricsData } from "@/util/types/LyricsData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const artist = req.nextUrl.searchParams.get("artist");
  const album = req.nextUrl.searchParams.get("album");
  const duration = req.nextUrl.searchParams.get("duration");

  if (!name || !artist || !album || !duration) {
    return NextResponse.json(
      { message: "Missing params (song, artist, album, duration)" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://lrclib.net/api/get?artist_name=${artist}&album_name=${album}&track_name=${name}&duration=${duration}`
  );
  if (res.status !== 200) {
    return NextResponse.json(
      { message: "Failed to fetch lyrics" },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json(
    {
      trackName: name,
      albumName: album,
      artistName: artist,
      duration: parseInt(duration),
      lyrics: {
        isSynced: data.syncedLyrics.length > 0,
        plainLyrics: data.plainLyrics,
        syncedLyrics: data.syncedLyrics,
      },
    } as LyricsData,
    { status: 200 }
  );
}
