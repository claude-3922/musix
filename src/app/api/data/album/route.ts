import { AlbumData } from "@/util/types/AlbumData";
import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import Innertube, { YTNodes } from "youtubei.js";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  let albumId: string | null = req.nextUrl.searchParams.get("id");

  if (!albumId || albumId.trim().length === 0) {
    console.log(" INFO /data/album 'No albumId provided'");
    return NextResponse.json(
      { message: "No albumId provided" },
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
    console.log(" INFO /data/album 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytmusic.getAlbum(albumId);
  if (!res) {
    console.log(` INFO /data/album 'Album with id ${albumId} not found'`);
    return NextResponse.json(
      { message: `Album with id ${albumId} not found` },
      { status: 404 }
    );
  }

  const albumSongs = await Promise.all(
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
          name:
            res.header?.as(YTNodes.MusicResponsiveHeader).strapline_text_one
              .text || "unknown",
          id:
            res.header?.as(YTNodes.MusicResponsiveHeader).strapline_text_one
              .endpoint?.payload.browseId || "unknown",
        },
        thumbnail: sortedThumbnails[0],
        moreThumbnails: sortedThumbnails.slice(1),
        album: {
          name: res.header?.title.text || "unknown",
          id: albumId || "unknown",
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

  const sortedThumbnails = res.header
    ?.as(YTNodes.MusicResponsiveHeader)
    .thumbnail?.contents.sort((a, b) => {
      return b.width - a.width;
    })
    .map((t) => t.url) || [""];

  return NextResponse.json(
    {
      name: res.header?.title.text || "unknown",
      id: albumId || "unknown",
      year: parseInt(
        res.header
          ?.as(YTNodes.MusicResponsiveHeader)
          .subtitle.text?.split("•")[1] || "0"
      ),
      artist: {
        name:
          res.header?.as(YTNodes.MusicResponsiveHeader).strapline_text_one
            .text || "unknown",
        id:
          res.header?.as(YTNodes.MusicResponsiveHeader).strapline_text_one
            .endpoint?.payload.browseId || "unknown",
      },
      thumbnail: sortedThumbnails[0],
      moreThumbnails: sortedThumbnails.slice(1),
      songs: albumSongs,
      explicit: Boolean(
        res.header
          ?.as(YTNodes.MusicResponsiveHeader)
          .subtitle_badge?.find(
            (b) => b.as(YTNodes.MusicInlineBadge).label === "Explicit"
          )
      ),
    } as AlbumData,
    { status: 200 }
  );
}
