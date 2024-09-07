/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useState } from "react";

interface SearchItemPlaylistProps {
  data: PlaylistMetadata;
  songState: StateManager<SongData | null>;
  dropdownItemId: StateManager<string | null>;
}

export default function SearchItemPlaylist({
  data,
  dropdownItemId,
}: SearchItemPlaylistProps) {
  const [buttonOnThumbnail, setButtonOnThumbnail] = useState(false);

  const listPlayHandler = () => {
    //fetch data from api
    //play first song
    //add rest to queue
  };

  return (
    <div className="flex justify-between items-center w-[80vw] h-[12vh] rounded-[4px] mb-[1vh] mx-[1vw] bg-white/10">
      <span
        className="flex justify-start items-center"
        onMouseOver={() => setButtonOnThumbnail(true)}
        onMouseOut={() => setButtonOnThumbnail(false)}
      >
        <span className="flex flex-col justify-center items-center w-[8vw] h-[12vh]">
          <span className="relative">
            <img
              className="object-cover rounded-[2px] w-[5vw] h-[5vw]"
              src={data.thumbnail}
            />
            {buttonOnThumbnail && (
              <div
                className="absolute z-[1] bg-black/40 w-[5vw] h-[5vw] top-[0] right-[0] hover:cursor-pointer"
                onClick={() => alert("nope")}
              >
                <img
                  className="absolute h-[2.5vw] z-[2] opacity-90 top-[25%] right-[25%]"
                  src="/icons/playFill.svg"
                />
              </div>
            )}
          </span>
        </span>
        <span className="flex flex-col items-start justify-center w-[60vw] h-[12vh]  overflow-hidden whitespace-nowrap">
          <h1>{data.title}</h1>

          <h1 className="text-sm">{data.owner.title}</h1>
        </span>
      </span>
      <span className="flex flex-col justify-center items-center w-[20vw] h-[12vh]">
        <button
          type="button"
          className="flex items-center justify-center relative rounded-full"
          onClick={() => {
            if (dropdownItemId && dropdownItemId.get === data.id) {
              dropdownItemId.set(null);
            } else {
              dropdownItemId.set(data.id);
            }
          }}
        >
          <img
            className="w-[1.5vw] h-[1.5vw] hover:scale-110"
            src="/icons/dots_vertical.svg"
          ></img>
          {dropdownItemId && dropdownItemId.get === data.id && (
            <div className="absolute z-[1] rounded-[4px] top-[3vw] right-[3vw] w-[10vw] h-[10vw] bg-custom_black/70">
              <div className="flex flex-col items-between justify-center divide-y w-[10vw] h-[10vw] whitespace-nowrap overflow-hidden">
                <button
                  className="hover:bg-white/20"
                  onClick={() => alert("nope")}
                >
                  PLAY NOW
                </button>
              </div>
            </div>
          )}
        </button>
      </span>
    </div>
  );
}
