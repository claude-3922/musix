import { NextRequest, NextResponse } from "next/server";
import ytsr from "@distube/ytsr";

import { durationSeconds } from "@/util/format";
import { getAccentColors } from "@/util/colors";
import { SongData } from "@/util/types/SongData";

export async function POST(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    console.log(" INFO /search 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const res = await ytsr(query, { limit: 10, safeSearch: false });
  if (!res) {
    console.log(" INFO /search 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }
  let returnArr: SongData[] = [];
  const vids = res.items.filter((item) => !item.isLive);
  for (let i = 0; i < vids.length; ++i) {
    const v = vids[i];

    let colorData = await getAccentColors(v.id);
    const songData = {
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
        accentColors: colorData?.pallete || "gray",
        topColor: colorData?.topC || "gray",
      },
    };

    returnArr[i] = songData;
  }

  return NextResponse.json(
    {
      query: res.query,
      items: returnArr,
    },
    { status: 200 }
  );
}
