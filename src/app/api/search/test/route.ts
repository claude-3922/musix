import { NextRequest, NextResponse } from "next/server";
import Innertube, { YTNodes } from "youtubei.js";

export async function GET(req: NextRequest) {
  const query: string | null = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    console.log(" INFO /search/top 'No query provided'");
    return NextResponse.json({ message: "No query provided" }, { status: 403 });
  }

  const ytMusic = (
    await Innertube.create({
      retrieve_player: false,
      generate_session_locally: false,
    })
  ).music;
  if (!ytMusic) {
    console.log(" INFO /search/top 'Error while initializing YTMusic'");
    return NextResponse.json(
      { message: "Error while initializing YTMusic" },
      { status: 500 }
    );
  }

  const res = await ytMusic.getRelated(query);
  return NextResponse.json(
    res
      .as(YTNodes.SectionList)
      .contents[0].as(YTNodes.MusicCarouselShelf)
      .contents[0].as(YTNodes.MusicResponsiveListItem),
    {
      status: 200,
    }
  );
}
