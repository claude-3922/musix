import { AlbumData } from "@/util/types/AlbumData";
import { ArtistData } from "@/util/types/ArtistData";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";

import YTMusic from "ytmusic-api";

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
    return NextResponse.json({ message: "No query provided" }, { status: 403 });
  }

  const ytMusic = await new YTMusic().initialize();
  if (!ytMusic) {
    console.log(" INFO /search/top 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.search(query);
  if (!res || res.length === 0) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const topResult =
    res.find((r) => r.name.toLowerCase() === query.toLowerCase()) || res[0];

  switch (topResult.type) {
    case "SONG":
      return NextResponse.json(
        {
          type: "SONG",
          data: {
            id: topResult.videoId,
            url: `https://www.youtube.com/watch?v=${topResult.videoId}`,
            title: topResult.name,
            thumbnail: topResult.thumbnails.sort((a, b) => b.width - a.width)[0]
              .url,
            duration: topResult.duration || 0,
            artist: {
              name: topResult.artist.name,
              id: topResult.artist.artistId,
            },
            album: {
              name: topResult.album?.name || undefined,
              id: topResult.album?.albumId || undefined,
            },
            moreThumbnails: topResult.thumbnails
              .sort((a, b) => b.width - a.width)
              .map((t) => t.url),
          } as SongData,
        },
        { status: 200 }
      );
    case "VIDEO":
      return NextResponse.json(
        {
          type: "VIDEO",
          data: {
            id: topResult.videoId,
            url: `https://www.youtube.com/watch?v=${topResult.videoId}`,
            title: topResult.name,
            thumbnail: topResult.thumbnails.sort((a, b) => b.width - a.width)[0]
              .url,
            duration: topResult.duration || 0,
            artist: {
              name: topResult.artist.name,
              id: topResult.artist.artistId,
            },
            moreThumbnails: topResult.thumbnails
              .sort((a, b) => b.width - a.width)
              .map((t) => t.url),
          } as SongData,
        },
        { status: 200 }
      );
    case "ALBUM":
      return NextResponse.json(
        {
          type: "ALBUM",
          data: {
            name: topResult.name,
            id: topResult.playlistId,
            artist: {
              name: topResult.artist.name,
              id: topResult.artist.artistId,
            },
            thumbnail: topResult.thumbnails.sort((a, b) => b.width - a.width)[0]
              .url,

            moreThumbnails: topResult.thumbnails
              .sort((a, b) => b.width - a.width)
              .map((t) => t.url),
            year: topResult.year,
          } as AlbumData,
        },
        { status: 200 }
      );
    case "ARTIST":
      return NextResponse.json(
        {
          type: "ARTIST",
          data: {
            name: topResult.name,
            id: topResult.artistId,

            thumbnail: topResult.thumbnails.sort((a, b) => b.width - a.width)[0]
              .url,

            moreThumbnails: topResult.thumbnails
              .sort((a, b) => b.width - a.width)
              .map((t) => t.url),
          } as ArtistData,
        },
        { status: 200 }
      );
    case "PLAYLIST":
      return NextResponse.json(
        {
          type: "PLAYLIST",
          data: {
            name: topResult.name,
            id: topResult.playlistId,
            owner: {
              name: topResult.artist.name,
              id: topResult.artist.artistId,
            },
            thumbnail: topResult.thumbnails.sort((a, b) => b.width - a.width)[0]
              .url,
            moreThumbnails: topResult.thumbnails
              .sort((a, b) => b.width - a.width)
              .map((t) => t.url),
          } as PlaylistMetadata,
        },
        { status: 200 }
      );
    default:
      return NextResponse.json(
        {
          message: "Invalid search result type",
        },
        { status: 404 }
      );
  }
}
