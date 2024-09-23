import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

import { Innertube, YTNodes } from "youtubei.js";
import YTMusic from "ytmusic-api";
import { ArtistMetadata } from "@/util/types/ArtistData";

export async function GET(req: NextRequest) {
  let songId: string | null = req.nextUrl.searchParams.get("id");
  //const artist: string | null = req.nextUrl.searchParams.get("artist");

  if (
    !songId ||
    songId.trim().length === 0
    // !artist ||
    // artist.trim().length === 0
  ) {
    console.log(" INFO /data/suggestions 'Invalid params'");
    return NextResponse.json({ message: "Invalid params" }, { status: 403 });
  }

  const yt = (
    await Innertube.create({
      retrieve_player: false,
      generate_session_locally: false,
    })
  ).music;

  const res = await yt.getUpNext(songId, true);
  const suggestions = res.contents.as(YTNodes.PlaylistPanelVideo).map((v) => {
    const sortedThumbnails = v.thumbnail
      .sort((a, b) => b.width - a.width)
      .map((t) => t.url);
    return {
      id: v.video_id,
      url: `https://www.youtube.com/watch?v=${v.video_id}`,
      title: v.title.text || "",
      thumbnail: sortedThumbnails[0],
      duration: v.duration.seconds || 0,
      artist: {
        name: v.artists ? v.artists[0].name : "",
        id: v.artists ? v.artists[0].channel_id : "",
      },
      album: {
        name: v.album?.name || "",
        id: v.album?.id || "",
      },
      explicit:
        Boolean(
          v.badges.find(
            (b) => b.as(YTNodes.MusicInlineBadge).label === "Explicit"
          )
        ) || false,
      moreThumbnails: sortedThumbnails.slice(1),
    } as SongData;
  });

  return NextResponse.json(suggestions.filter(Boolean) as SongData[], {
    status: 200,
  });
}
