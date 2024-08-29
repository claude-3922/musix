import { NextRequest, NextResponse } from "next/server";
import ytsr from "@distube/ytsr";

import { durationSeconds } from "@/util/format";

import { SongData } from "@/util/types/SongData";

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

  const res = await ytsr(query, { limit: count, safeSearch: false });
  if (!res) {
    console.log(" INFO /search/songs 'No songs found'");
    return NextResponse.json({ message: "No songs foun" }, { status: 404 });
  }

  let songArray: SongData[] = [];

  const vids = res.items.filter((item) => !item.isLive);

  for (let i = 0; i < vids.length; ++i) {
    const v = vids[i];

    const songData: SongData = {
      vid: {
        id: v.id,
        url: v.url,
        title: v.name,
        thumbnail: v.thumbnail,
        duration: durationSeconds(v.duration),
      },
      owner: {
        title: v.author?.name || "NOT_FOUND",
        url: v.author?.url || "NOT_FOUND",
        thumbnail: v.author?.bestAvatar.url || "/def_user_thumbnail.jpg",
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

  return NextResponse.json(
    {
      topResult: topResult,
      songs: songArray,
    },
    { status: 200 }
  );
}
