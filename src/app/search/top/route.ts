import { NextRequest, NextResponse } from "next/server";
import Youtube from "youtube-sr";

import { durationSeconds } from "@/util/format";

import { SongData } from "@/util/types/SongData";
import { sortSongDurations } from "@/util/sort";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";
import { ChannelMetadata } from "@/util/types/ChannelMetadata";

export async function POST(req: NextRequest) {
  let query: string | null = null;

  try {
    const body = await req.json();
    query = body.query;
  } catch (error) {
    console.log(" INFO /search/top 'Invalid request body'");
    console.log(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 403 }
    );
  }

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/top 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const res = await Youtube.search(query, {
    limit: 1,
    safeSearch: true,
    type: "all",
  });
  if (!res) {
    console.log(" INFO /search/top 'No songs found'");
    return NextResponse.json({ message: "No songs found" }, { status: 404 });
  }

  let info = res[0];
  let data: SongData | PlaylistMetadata | ChannelMetadata;
  if (info.type === "video") {
    data = {
      vid: {
        id: info.id || "NOT_FOUND",
        url: info.url,
        title: info.title || "NOT_FOUND",
        thumbnail: info.thumbnail?.url || "/def_vid_thumbnail.jpg",
        duration: info.duration / 1000,
      },
      owner: {
        title: info.channel?.name || "NOT_FOUND",
        url: info.channel?.url || "NOT_FOUND",
        thumbnail: info.channel?.icon.url || "/def_user_thumbnail.jpg",
      },
      playerInfo: {},
    };
  } else if (info.type === "playlist") {
    data = {
      id: info.id || "NOT_FOUND",
      url: info.url || "NOT_FOUND",
      title: info.title || "NOT_FOUND",
      thumbnail: info.thumbnail?.url || "/def_vid_thumbnail.jpg",

      owner: {
        title: info.channel?.name || "NOT_FOUND",
        url: info.channel?.url || "NOT_FOUND",
        thumbnail: info.channel?.icon.url || "/def_user_thumbnail.jpg",
      },
    };
  } else if (info.type === "channel") {
    data = {
      title: info.name || "NOT_FOUND",
      url: info.url || "NOT_FOUND",
      thumbnail: info.icon?.url || "/def_user_thumbnail.jpg",
      id: info.id || "NOT_FOUND",
    };
  }

  return NextResponse.json(
    {
      type: info.type,
      data: data!,
    },
    { status: 200 }
  );
}
