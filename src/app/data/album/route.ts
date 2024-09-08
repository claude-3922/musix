import { AlbumData } from "@/util/types/AlbumData";
import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
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

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /data/album 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.getAlbum(albumId);
  if (!res) {
    console.log(` INFO /data/album 'Album with id ${albumId} not found'`);
    return NextResponse.json(
      { message: `Album with id ${albumId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      id: res.albumId,
      name: res.name,
      thumbnail: res.thumbnails.sort((a, b) => b.width - a.width)[0].url,

      artist: {
        name: res.artist.name,
        id: res.artist.artistId || "Unknown",
      },
      moreThumbnails: res.thumbnails
        .sort((a, b) => b.width - a.width)
        .map((t) => t.url),
      year: res.year || -1,
      songs: res.songs.map((s) => {
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
          album: {
            name: res.name,
            id: res.albumId,
          },
          moreThumbnails: s.thumbnails
            .sort((a, b) => b.width - a.width)
            .map((t) => t.url),
        };
      }),
    } as AlbumData,
    { status: 200 }
  );
}
