/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React from "react";
import OverlayIcon from "../Util/OverlayIcon";
import { formatSongDuration } from "@/util/format";
import { Explcit, PlaySymbol } from "../Icons/Icons";
import { FetchState } from "@/app/hooks/Fetch";

interface SuggestionsProps {
  related: FetchState<SongData[]>;
  songState: StateManager<SongData | null>;
  audioPlayer: HTMLAudioElement | null;
}

export default function Suggestions({
  related,
  songState,
  audioPlayer,
}: SuggestionsProps) {
  const suggestionsContainerRef = React.useRef<HTMLDivElement | null>(null);

  if (related.pending) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        Loading....
      </div>
    );
  }

  if (related.error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        No suggestions found.
      </div>
    );
  }

  return (
    <div className="w-[98%] h-full flex flex-col items-center justify-start overflow-x-hidden">
      <div className="flex flex-col items-center justify-start w-full h-[75%] overflow-x-hidden">
        <span className="h-[14%] w-full flex items-center justify-between opacity-80">
          <p className="w-[80%] mx-[1%]">Related</p>
        </span>
        <div
          ref={suggestionsContainerRef}
          className="w-full min-h-[80%] max-h-[80%] flex flex-col items-center justify-start overflow-x-hidden  overflow-y-scroll pr-1 snap-y snap-mandatory"
        >
          {related.data &&
            related.data
              .filter((s) => s.id !== songState.get?.id)
              .map((song, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center min-h-[25%] max-h-[25%] w-full snap-always snap-start"
                  >
                    <OverlayIcon
                      thumbnailURL={song.thumbnail}
                      width={"10%"}
                      height={"90%"}
                      iconStyle={{
                        overflow: "hidden",
                        margin: "2%",
                      }}
                    >
                      <PlaySymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
                    </OverlayIcon>

                    <span className="flex flex-col items-start justify-center grow whitespace-nowrap text-ellipsis min-w-[60%] max-w-[60%] overflow-hidden">
                      <span className="flex items-center justify-start w-full h-[50%] gap-1">
                        {song.title}
                        {song.explicit && (
                          <Explcit size={"18px"} opacity={0.6} />
                        )}
                      </span>
                      <h1 className="text-sm">{song.artist.name}</h1>
                    </span>
                    <span className="flex items-center justify-end gap-2 w-[30%] h-full">
                      <h1 className="text-sm opacity-50 w-[28%]">
                        {formatSongDuration(song.duration)}
                      </h1>
                    </span>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
