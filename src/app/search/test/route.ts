import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return console.log("AAAA NO QUERY RAHH");

  const ytmusic = new YTMusic();
  const yt = await ytmusic.initialize();
  if (!yt) return console.log("NO YT");
  const res = await yt.getArtist(query);
  console.log(res);
  return NextResponse.json(res);
}
