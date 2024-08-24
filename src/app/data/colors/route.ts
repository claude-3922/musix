import { NextRequest, NextResponse } from "next/server";

import { getAccentColors } from "@/util/colors";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    console.log(" INFO /data/colors 'No id provided'");
    return NextResponse.json({ message: "No id provided" }, { status: 403 });
  }

  const colors = await getAccentColors(id);
  return NextResponse.json(
    {
      accentColors: colors?.colors,
      topColor: colors?.topColor,
    },
    { status: 200 }
  );
}
