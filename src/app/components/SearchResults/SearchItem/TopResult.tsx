/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from "@/util/format";
import { ChannelMetadata } from "@/util/types/ChannelMetadata";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";
import { SongData } from "@/util/types/SongData";
import React, { useState } from "react";

interface TopResultProps {
  type: "video" | "playlist" | "channel";
  data: SongData | PlaylistMetadata | ChannelMetadata;
}

export default function TopResult({ type, data }: TopResultProps) {
  const [dropdownPos, setDropdownPos] = useState({ left: "0px", top: "0px" });

  return (
    <div className="flex items-center rounded-[4px] h-[20vh] w-[80vw] bg-white/10 mx-[1vw]">
      <span className="w-[15vw] h-[15vh] rounded-[4px] overflow-hidden mx-[1vw]">
        {type === "video" ? (
          <img
            className="w-[15vw] h-[15vh] rounded-[4px] object-cover"
            src={(data as SongData).vid.thumbnail}
          ></img>
        ) : type === "playlist" ? (
          <img
            className="w-[15vw] h-[15vh] rounded-[4px] object-cover"
            src={(data as PlaylistMetadata).thumbnail}
          ></img>
        ) : (
          <img
            className="w-[15vw] h-[15vh] rounded-[4px] object-cover"
            src={(data as ChannelMetadata).thumbnail}
          ></img>
        )}
      </span>
      <span className="flex flex-col gap-4 items-start justify-center">
        <span>
          <h1 className="text-lg w-[60ch] overflow-hidden whitespace-nowrap">
            {type === "video"
              ? (data as SongData).vid.title
              : (data as PlaylistMetadata | ChannelMetadata).title}
          </h1>
          {type === "channel" ? (
            <></>
          ) : (
            <h1 className="text-base w-[60ch] overflow-hidden whitespace-nowrap">
              {(data as SongData | PlaylistMetadata).owner.title}
            </h1>
          )}
        </span>

        <span className="flex justify-center items-center gap-8">
          <span className="flex justify-center items-center gap-2">
            <button className="rounded-full border-2 px-[1vw] py-[0.5vh]">
              Play
            </button>
            <button className="rounded-full border-2 px-[1vw] py-[0.5vh]">
              Add to queue
            </button>
            <span
              //type="button"
              className="flex items-center justify-center relative rounded-full hover:cursor-pointer"
              onClick={(e) => {
                setDropdownPos({
                  left: `${e.clientX - 20}px`,
                  top: `${e.clientY - 20}px`,
                });
                //toggleDropdown();
              }}
            >
              <img
                className="w-[1.5vw] h-[1.5vw] hover:scale-110"
                src="/icons/dots_vertical.svg"
              ></img>
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
