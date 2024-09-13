/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import OverlayIcon from "../Util/OverlayIcon";
import { formatSongDuration } from "@/util/format";
import { play } from "@/player/manager";
import { Chevron_0Deg, PlaySymbol } from "../Icons/Icons";

interface SuggestionsProps {
  currentSongId: string | null;
  songState: StateManager<SongData | null>;
}

export default function Suggestions({
  currentSongId,
  songState,
}: SuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SongData[] | null>(null);

  useEffect(() => {
    if (!currentSongId) return;

    setLoading(true);

    async function init() {
      setSuggestions(null);
      const res = await fetch(`api/data/suggestions?id=${currentSongId}`);
      if (res.status === 200) {
        const data: SongData[] = await res.json();
        setSuggestions(data);
        setLoading(false);
      }
    }

    init();
  }, [currentSongId]);

  if (!currentSongId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        Player not found.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        Loading....
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        No suggestions found.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-x-hidden bg-white/10">
      <div className="flex flex-col items-center justify-end w-full h-[75%] bg-black/10">
        <span className="text-xl h-[14%] w-full flex items-center justify-between">
          Suggestions
          <span className="w-full h-full flex items-center justify-end gap-4">
            <button className="h-full w-[6%] rotate-180 opacity-60 hover:scale-110 hover:opacity-100">
              <Chevron_0Deg size={"100%"} fill={"#e8eaed"} opacity={0.8} />
            </button>
            <button className="h-full w-[6%] opacity-60 hover:scale-110 hover:opacity-100">
              <Chevron_0Deg size={"100%"} fill={"#e8eaed"} opacity={0.8} />
            </button>
          </span>
        </span>
        <div
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(0, 0,0, 0.3) 100%)",
          }}
          className="w-full h-[86%] flex flex-col items-center justify-start"
        ></div>
      </div>
    </div>
  );
}
