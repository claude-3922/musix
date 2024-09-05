import { NextRequest, NextResponse } from "next/server";
import Youtube from "youtube-sr";

import { durationSeconds } from "@/util/format";

import { SongData } from "@/util/types/SongData";
import { sortSongDurations } from "@/util/sort";

export async function POST(req: NextRequest) {
  let query: string | null = null;
  let count = 5;

  try {
    const body = await req.json();
    query = body.query;
    count = body.count;
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

  const res = await Youtube.search(query, {
    limit: count,
    safeSearch: true,
    type: "video",
  });
  if (!res) {
    console.log(" INFO /search/songs 'No songs found'");
    return NextResponse.json({ message: "No songs found" }, { status: 404 });
  }

  let songArray: SongData[] = [];

  const vids = res.filter((item) => !item.live);

  for (let i = 0; i < vids.length; ++i) {
    const v = vids[i];

    const songData: SongData = {
      vid: {
        id: v.id || "NOT_FOUND",
        url: v.url,
        title: v.title || "NOT_FOUND",
        thumbnail: v.thumbnail?.url || "/def_vid_thumbnail.jpg",
        duration: v.duration / 1000,
      },
      owner: {
        title: v.channel?.name || "NOT_FOUND",
        url: v.channel?.url || "NOT_FOUND",
        thumbnail: v.channel?.icon.url || "/def_user_thumbnail.jpg",
      },
      playerInfo: {
        accentColors: undefined,
        topColor: undefined,
      },
    };

    songArray[i] = songData;
  }

  const topResult =
    songArray.find(
      (song) => song.vid.title.toLowerCase() === query.toLowerCase()
    ) || songArray[0];
  songArray = songArray.filter(
    (song) => song.vid.title.toLowerCase() !== topResult.vid.title.toLowerCase()
  );

  sortSongDurations(songArray);

  return NextResponse.json(
    {
      topResult: topResult,
      data: songArray,
    },
    { status: 200 }
  );
}
