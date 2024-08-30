import { NextRequest, NextResponse } from "next/server";
import ytsr from "@distube/ytsr";

import { durationSeconds } from "@/util/format";

import { SongData } from "@/util/types/SongData";
import { sortSongDurations } from "@/util/sort";
import YouTube from "youtube-sr";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await YouTube.search(body.query, {
    limit: 20,
    type: "playlist",
  });
  return NextResponse.json(result, { status: 200 });
}
