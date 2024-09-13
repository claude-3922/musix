import { AlbumData } from "@/util/types/AlbumData";
import { PlaylistData } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import Innertube, { YTNodes } from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  let playlistId: string | null = req.nextUrl.searchParams.get("id");

  if (!playlistId || playlistId.trim().length === 0) {
    console.log(" INFO /data/playlist 'No playlistId provided'");
    return NextResponse.json(
      { message: "No playlistId provided" },
      { status: 403 }
    );
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /data/playlist 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const songsRes = await ytMusic.getPlaylistVideos(playlistId);

  if (!songsRes) {
    console.log(
      ` INFO /data/playlist 'Error fetching data for playlist ${playlistId}'`
    );
    return NextResponse.json(
      { message: `Error fetching data for playlist ${playlistId}` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    [
      songsRes.map((s) => {
        return {
          id: s.videoId,
          url: `https://www.youtube.com/watch?v=${s.videoId}`,
          title: s.name,
          thumbnail: s.thumbnails.sort((a, b) => b.width - a.width)[0].url,
          duration: s.duration || 0,
          artist: {
            name: s.artist.name,
            id: s.artist.artistId || "Unknown",
          },
          moreThumbnails: s.thumbnails
            .sort((a, b) => b.width - a.width)
            .map((t) => t.url),
        };
      }),
    ] as unknown as SongData[],
    { status: 200 }
  );
}
