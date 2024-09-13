import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/videos 'No query provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /search/videos 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.searchVideos(query);
  if (!res || res.length === 0) {
    console.log(" INFO /search/videos 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  let videos: SongData[] = [];
  for (const video of res) {
    videos.push({
      id: video.videoId,
      url: `https://www.youtube.com/watch?v=${video.videoId}`,
      title: video.name,
      thumbnail: video.thumbnails.sort((a, b) => b.width - a.width)[0].url,
      duration: video.duration || 0,
      artist: {
        name: video.artist.name,
        id: video.artist.artistId || "Unknown",
      },
      moreThumbnails: video.thumbnails
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url),
    });
  }

  return NextResponse.json(videos, { status: 200 });
}
