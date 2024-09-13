import { SongData } from "@/util/types/SongData";
import React from "react";

interface NowPlayingProps {
  data: SongData;
}

export default function NowPlaying({ data }: NowPlayingProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black overflow-hidden gap-1">
      <span className="text-2xl max-w-[90%] bg-white/10 max-h-[30%] overflow-hidden text-ellipsis">
        {data.title}
      </span>
      <span className="text-xl max-w-[90%] bg-white/10 max-h-[16%] overflow-hidden text-ellipsis">
        {data.artist.name}
      </span>
    </div>
  );
}
