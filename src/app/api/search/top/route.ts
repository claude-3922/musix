import { AlbumData } from "@/util/types/AlbumData";
import { ArtistData } from "@/util/types/ArtistData";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { NextRequest, NextResponse } from "next/server";
import Innertube, { YTNodes } from "youtubei.js";

import YTMusic from "ytmusic-api";

/**
 * TODO: Add support for artists, albums, playlists when the YTMusic Library is fixed
 */

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/top 'No query provided'");
    return NextResponse.json({ message: "No query provided" }, { status: 403 });
  }

  const ytMusic = (
    await Innertube.create({
      retrieve_player: false,
      generate_session_locally: true,
    })
  ).music;
  if (!ytMusic) {
    console.log(" INFO /search/top 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.search(query, { type: "song" });
  if (!res) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const top = res.songs?.contents[0];
  if (!top) {
    console.log(" INFO /search/top 'No search results found'");
    return NextResponse.json(
      { message: "No search results found" },
      { status: 404 }
    );
  }

  const sortedThumbnails = top.thumbnail?.contents
    .sort((a, b) => b.width - a.width)
    .map((t) => t.url) || [""];

  return NextResponse.json(
    {
      type: "SONG",
      data: {
        id: top.id || "",
        url: `https://www.youtube.com/watch?v=${top.id || ""}`,
        title: top.title || "",
        thumbnail: sortedThumbnails[0],
        duration: top.duration?.seconds || 0,
        artist: {
          name: top.flex_columns[1].title.runs?.flat()[0].text || "",
          id: top.flex_columns[1].title.endpoint?.payload.browseId || "",
        },
        album: {
          name: top.album ? top.album.name || "" : "",
          id: top.album ? top.album.id || "" : "",
          year: top.year,
        },
        moreThumbnails: sortedThumbnails.slice(1),
        explicit:
          Boolean(
            top.badges
              ?.as(YTNodes.MusicInlineBadge)
              .find((b) => b.label === "Explicit")
          ) || false,
      } as SongData,
    },
    { status: 200 }
  );
}
