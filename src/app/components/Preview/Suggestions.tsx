/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import OverlayIcon from "../Util/OverlayIcon";
import { formatSongDuration } from "@/util/format";
import { play } from "@/player/manager";
import ExpandableList from "../Util/ExpandableList";

interface SuggestionsProps {
  currentSongId: string | null;
  songState: StateManager<SongData | null>;
}

export default function Suggestions({
  currentSongId,
  songState,
}: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SongData[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    async function init() {
      if (!currentSongId) return;
      const res = await fetch(`/data/suggestions?id=${currentSongId}`);
      if (res.status === 200) {
        const data: SongData[] = await res.json();
        setSuggestions(data);
        setLoading(false);
      }
    }

    init();
  }, [currentSongId]);

  if (!currentSongId) {
    return <>Nothing currently playing</>;
  }
  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div className="">
      {suggestions
        ? suggestions.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-start bg-white/10 mb-[1%] rounded"
            >
              <span className="flex items-center justify-center w-[5%]">
                {i + 1}
              </span>

              <OverlayIcon
                thumbnailURL={s.thumbnail}
                width="5vw"
                height="5vw"
                iconStyle={{
                  borderRadius: "3px",
                  overflow: "hidden",
                  margin: "0.5vw 0.5vw",
                }}
                onClick={async () => await play(songState, s)}
              >
                <img
                  src="/icons/playFill.svg"
                  alt="Play"
                  width={"50%"}
                  height={"50%"}
                />
              </OverlayIcon>

              <span className="flex flex-col items-start justify-center grow max-w-[60%]">
                <p>{s.title}</p>
                <p className="text-sm w-[100%] overflow-hidden whitespace-nowrap text-ellipsis">
                  {s.artist.name}
                </p>
              </span>
              <span className="flex gap-2 items-center justify-center w-[20%]">
                <p className="text-sm opacity-50">
                  {formatSongDuration(s.duration)}
                </p>
              </span>
            </div>
          ))
        : "No suggestions found."}
    </div>
  );
}
