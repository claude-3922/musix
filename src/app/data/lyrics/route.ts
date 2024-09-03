import { NextRequest, NextResponse } from "next/server";
import { Client } from "genius-lyrics";

const GeniusClient = new Client();

export async function POST(req: NextRequest) {
  let title = null;

  try {
    const body = await req.json();
    title = body.title;
  } catch (error) {
    console.log(" INFO /data/lyrics 'Invalid request body'");
    console.log(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 403 }
    );
  }

  if (!title) {
    console.log(" INFO /data/lyrics 'No song title given'");
    return NextResponse.json(
      { message: "No song title given" },
      { status: 403 }
    );
  }

  const search = await GeniusClient.songs.search(title);
  if (search.length === 0) {
    return NextResponse.json(
      { message: `No search result for title ${title} was found` },
      { status: 404 }
    );
  }

  const bestResult = search[0];
  const lyrics = await bestResult.lyrics();

  return NextResponse.json({ lyrics: lyrics }, { status: 200 });
}
