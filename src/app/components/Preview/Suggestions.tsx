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
    return <>Nothing currently playing</>;
  }

  if (loading) return <>Loading...</>;

  return (
    <>
      {suggestions
        ? suggestions.map((s, i) => {
            return (
              <span
                key={i}
                className="flex items-center justify-start bg-white/[5%] mb-[0.5%]"
              >
                <span className="flex items-center justify-center w-[5%]">
                  {i + 1}
                </span>

                <OverlayIcon
                  thumbnailURL={s.thumbnail}
                  width="5vw"
                  height="5vw"
                  iconStyle={{
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
                  <span className="flex items-center justify-start w-full whitespace-nowrap text-ellipsis">
                    {s.title}
                    {s.explicit && (
                      <button
                        disabled
                        className="text-[8px] rounded-full w-[12%] h-[5%] border-[1px] ml-[2%] "
                      >
                        EXPLICIT
                      </button>
                    )}
                  </span>
                  <p className="text-sm w-[100%] overflow-hidden whitespace-nowrap text-ellipsis">
                    {s.artist.name}
                  </p>
                </span>

                <span className="flex gap-2 items-center justify-center w-[20%]">
                  <p className="text-sm opacity-50">
                    {formatSongDuration(s.duration)}
                  </p>
                </span>
              </span>
            );
          })
        : "No suggestions found."}
    </>
  );
}
