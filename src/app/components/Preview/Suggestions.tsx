/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import OverlayIcon from "../Util/OverlayIcon";
import { formatSongDuration } from "@/util/format";
import { play } from "@/player/manager";
import { Chevron_0Deg, PlaySymbol } from "../Icons/Icons";

interface SuggestionsProps {
  suggestions: SongData[] | null;
  suggestionsLoading: boolean;
  songState: StateManager<SongData | null>;
}

export default function Suggestions({
  suggestions,
  songState,
  suggestionsLoading,
}: SuggestionsProps) {
  const suggestionsContainerRef = React.useRef<HTMLDivElement | null>(null);
  // const songElementRef = React.useRef<HTMLDivElement | null>(null);

  if (suggestionsLoading) {
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
    <div className="w-full h-full flex flex-col items-center justify-start overflow-x-hidden">
      <div className="flex flex-col items-center justify-start w-full h-[75%] overflow-x-hidden">
        <span className="text-xl h-[14%] w-full flex items-center justify-between">
          <p className="w-[80%] mx-[1%]">Songs you might like</p>
          <span className="w-[20%] h-full flex items-center justify-end gap-4 mx-[1%]">
            <button
              className="h-full w-[25%] rotate-[270deg] opacity-60 hover:scale-110 hover:opacity-100"
              onClick={() => {
                if (!suggestionsContainerRef.current) return;
                suggestionsContainerRef.current.scrollBy({
                  top: -suggestionsContainerRef.current.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} fill={"#e8eaed"} opacity={0.8} />
            </button>
            <button
              className="h-full w-[25%] rotate-90 opacity-60 hover:scale-110 hover:opacity-100"
              onClick={() => {
                if (!suggestionsContainerRef.current) return;
                suggestionsContainerRef.current.scrollBy({
                  top: suggestionsContainerRef.current.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} fill={"#e8eaed"} opacity={0.8} />
            </button>
          </span>
        </span>
        <div
          ref={suggestionsContainerRef}
          className="relative w-full min-h-[80%] max-h-[80%] flex flex-col items-center justify-start overflow-x-hidden overflow-y-hidden"
        >
          {suggestions.map((song, i) => {
            return (
              <div
                key={i}
                className="flex items-center justify-start w-full min-h-[25%] max-h-[25%] bg-white/5 overflow-x-hidden"
              >
                <OverlayIcon
                  thumbnailURL={song.thumbnail}
                  width={"12%"}
                  height={"90%"}
                  iconStyle={{ overflow: "hidden", margin: "0px 1%" }}
                  onClick={async () => await play(songState, song)}
                >
                  <PlaySymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
                </OverlayIcon>
                <span className="h-[90%] w-[65%] flex flex-col items-start justify-center overflow-hidden whitespace-nowrap">
                  <p>{song.title}</p>
                  <p className="text-sm opacity-80">{song.artist.name}</p>
                </span>
                <span className="text-sm opacity-60 w-[35%] flex items-center justify-end">
                  <p className="mx-[12.5%]">
                    {formatSongDuration(song.duration)}
                  </p>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
