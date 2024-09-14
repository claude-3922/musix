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
  const songElementRef = React.useRef<HTMLDivElement | null>(null);

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

  const bundledSongs = bundleSongs(suggestions, 4);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-x-hidden">
      <div className="flex flex-col items-center justify-end w-full h-[75%] overflow-x-hidden">
        <span className="text-xl h-[14%] w-full flex items-center justify-between">
          Suggestions
          <span className="w-full h-full flex items-center justify-end gap-4">
            <button
              className="h-full w-[6%] rotate-180 opacity-60 hover:scale-110 hover:opacity-100"
              onClick={() => {
                if (!suggestionsContainerRef.current || !songElementRef.current)
                  return;
                suggestionsContainerRef.current.scrollBy({
                  left: -songElementRef.current.offsetLeft / 4,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} fill={"#e8eaed"} opacity={0.8} />
            </button>
            <button
              className="h-full w-[6%] opacity-60 hover:scale-110 hover:opacity-100"
              onClick={() => {
                if (!suggestionsContainerRef.current || !songElementRef.current)
                  return;
                suggestionsContainerRef.current.scrollBy({
                  left: songElementRef.current.offsetLeft / 4,
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
          className="relative w-full min-h-[86%] max-h-[86%] flex flex-col items-start justify-start overflow-x-hidden overflow-y-scroll"
        >
          {bundledSongs.map((songRow, i) => {
            return (
              <div
                key={i}
                className="min-w-[240%] max-w-[240%] min-h-[33.3%] max-h-[33.3%] flex items-center justify-start"
              >
                {songRow.map((song, i) => {
                  return (
                    <span
                      ref={songElementRef}
                      key={i}
                      className="h-full min-w-[33.3%] max-w-[33.3%] bg-white/5 flex items-center justify-start overflow-x-hidden"
                    >
                      <OverlayIcon
                        thumbnailURL={song.thumbnail}
                        width={"17%"}
                        height={"90%"}
                        iconStyle={{ overflow: "hidden", margin: "0px 2.5%" }}
                        onClick={async () => await play(songState, song)}
                      >
                        <PlaySymbol size={"50%"} opacity={0.8}></PlaySymbol>
                      </OverlayIcon>
                      <span className="w-[50%] h-full flex flex-col items-start justify-center gap-1 text-nowrap">
                        <span className="w-full h-[50%] flex flex-col items-start justify-start">
                          <p>{song.title}</p>
                          <p className="text-sm ">{song.artist.name}</p>
                        </span>
                        <p className="text-sm opacity-60">
                          {formatSongDuration(song.duration)}
                        </p>
                      </span>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const bundleSongs = (songs: SongData[], songsPerColumn: number) => {
  const result: SongData[][] = [];
  for (let i = 0; i < songs.length; i += songsPerColumn) {
    result.push(songs.slice(i, i + songsPerColumn));
  }
  return result;
};
