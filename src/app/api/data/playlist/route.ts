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

  const ytmusic = (
    await Innertube.create({
      retrieve_player: false,
      generate_session_locally: false,
    })
  ).music;
  if (!ytmusic) {
    console.log(" INFO /data/playlist 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytmusic.getPlaylist(playlistId);
  if (!res) {
    console.log(
      ` INFO /data/playlist 'Playlist with id ${playlistId} not found'`
    );
    return NextResponse.json(
      { message: `Playlist with id ${playlistId} not found` },
      { status: 404 }
    );
  }

  if (!res.contents) {
    console.log(
      ` INFO /data/playlist 'No content for playlist found with id ${playlistId}'`
    );
    return NextResponse.json(
      { message: `No content for playlist found with id ${playlistId}` },
      { status: 404 }
    );
  }

  const playlistSongs = await Promise.all(
    res.contents.map(async (s) => {
      const song = await ytmusic.getInfo(s.id!);
      const sortedThumbnails = song.basic_info.thumbnail
        ?.sort((a, b) => {
          return b.width - a.width;
        })
        .map((t) => t.url) || [""];
      return {
        id: song.basic_info.id || "unknown",
        title: song.basic_info.title || "unknown",
        url: `https://www.youtube.com/watch?v=${song.basic_info.id || ""}`,
        artist: {
          name: song.basic_info.author || "unknown",
          id: song.basic_info.channel?.id || "unknown",
        },
        thumbnail: sortedThumbnails[0],
        moreThumbnails: sortedThumbnails.slice(1),
        album: {
          name:
            res.header?.as(YTNodes.MusicResponsiveHeader).title.text ||
            "unknown",
          id: playlistId || "unknown",
        },
        duration: song.basic_info.duration || 0,
        explicit: Boolean(
          s.badges?.find(
            (b) => b.as(YTNodes.MusicInlineBadge).label === "Explicit"
          )
        ),
      } as SongData;
    })
  );

  return NextResponse.json(playlistSongs, { status: 200 });
}
