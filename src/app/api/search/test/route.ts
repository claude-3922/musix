import { SongData } from "@/util/types/SongData";
import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";
import YouTube from "youtube-sr";
import Innertube from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/top 'No query provided'");
    return NextResponse.json({ message: "No query provided" }, { status: 403 });
  }

  // const res = await ytdl.getInfo(query, { limit: 1 });
  // const top = res[0];

  // const ytMusic = await (await Innertube.create()).music;
  // if (!ytMusic) {
  //   console.log(" INFO /search/top 'Error while initializing YTMusic'");
  //   return NextResponse.json(
  //     { message: "Error while initializing YTMusic" },
  //     { status: 500 }
  //   );
  // }

  // const res = await ytMusic.search(query);
  // if (!res) {
  //   console.log(" INFO /search/top 'No search results found'");
  //   return NextResponse.json(
  //     { message: "No search results found" },
  //     { status: 404 }
  //   );
  // }

  // const top = res.songs?.contents[0];
  // if (!top) {
  //   console.log(" INFO /search/top 'No search results found'");
  //   return NextResponse.json(
  //     { message: "No search results found" },
  //     { status: 404 }
  //   );
  // }

  return NextResponse.json(
    {
      // type: "SONG",
      // data: {
      //   id: top.id || "UNKNOWN",
      //   url: `https://www.youtube.com/watch?v=${top.id || ""}`,
      //   title: top.title || "UNKNOWN",
      //   thumbnail: top.thumbnail || "",
      //   duration: top.duration,
      //   artist: {
      //     name: top.channel ? top.channel.name : "UNKNOWN",
      //     id: top.channel ? top.channel.id : "UNKNOWN",
      //   },
      // } as SongData,
      a: "b",
    },
    { status: 200 }
  );
}
