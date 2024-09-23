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

  const yt = await Innertube.create({
    retrieve_player: false,
    generate_session_locally: false,
  });

  const res = await yt.music.getRelated(songId);
  const suggestions = await Promise.all(
    res
      .as(YTNodes.SectionList)
      .contents[0].as(YTNodes.MusicCarouselShelf)
      .contents.map((item) => item.as(YTNodes.MusicResponsiveListItem))
      .map(async (item, i) => {
        if (!item.id) return;
        let thisSong = await yt.music.getInfo(item.id!);
        const sortedThumbnails = item.thumbnails
          .sort((a, b) => b.width - a.width)
          .map((t) => t.url);
        return {
          id: item.id || thisSong.basic_info.id || "",
          url: `https://www.youtube.com/watch?v=${
            item.id || thisSong.basic_info.id || ""
          }`,
          title: item.flex_columns[0].title.text?.toString() || "",
          thumbnail: sortedThumbnails[0],
          duration: item.duration?.seconds || thisSong.basic_info.duration || 0,
          artist: {
            name: item.flex_columns[1].title.text?.toString() || "",
            id: item.flex_columns[1].title.endpoint?.payload?.browseId || "",
          },
          album: {
            name: item.flex_columns[2].title.text?.toString() || "",
            id: item.flex_columns[2].title.endpoint?.payload?.browseId || "",
          },
          moreThumbnails: sortedThumbnails.slice(1),
          explicit:
            Boolean(
              item.badges?.find(
                (b) => b.as(YTNodes.MusicInlineBadge).label === "Explicit"
              )
            ) || false,
        };
      })
  );

  return NextResponse.json(suggestions.filter(Boolean) as SongData[], {
    status: 200,
  });
}
