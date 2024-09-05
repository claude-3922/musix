/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { queueDB } from "@/db/queueDB";
import { formatSongDuration } from "@/util/format";
import { isOverflown } from "@/util/generalUtil";
import { detectMouseButton } from "@/util/input";

import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useRef, useState } from "react";
import { heartFill, heartNoFill } from "../../Player/Extras";
import { pSBC } from "@/util/pSBC";

interface SearchItemSongProps {
  data: SongData;
  songState: StateManager<SongData | null>;
  dropdownItemId: StateManager<string | null>;
}

export default function SearchItemSong({
  data,
  songState,
  dropdownItemId,
}: SearchItemSongProps) {
  const { vid, owner } = data;

  const [buttonOnThumbnail, setButtonOnThumbnail] = useState(false);
  const [liked, setLiked] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ left: "0px", top: "0px" });
  const [playlistDropdown, setPlaylistDropdown] = useState(false);

  const toggleDropdown = () => {
    if (dropdownItemId && dropdownItemId.get === data.vid.id) {
      dropdownItemId.set(null);
    } else {
      dropdownItemId.set(data.vid.id);
    }
  };

  const dropdownMenuBg = `linear-gradient(to top, ${pSBC(
    0.98,
    "#ffffff",
    "#000000"
  )}, ${pSBC(0.96, "#ffffff", "#000000")}, ${pSBC(
    0.98,
    "#ffffff",
    "#000000"
  )})`;

  return (
    <div
      className="flex justify-between items-center w-[80vw] h-[12vh] rounded-[4px] mb-[1vh] mx-[1vw] bg-white/10 "
      onContextMenu={(e) => {
        setDropdownPos({
          left: `${e.clientX - 20}px`,
          top: `${e.clientY - 20}px`,
        });

        toggleDropdown();
      }}
    >
      <span className="flex justify-start items-center">
        <span className="flex flex-col justify-center items-center w-[8vw] h-[12vh]">
          <span
            className="relative"
            onMouseOver={() => setButtonOnThumbnail(true)}
            onMouseOut={() => setButtonOnThumbnail(false)}
          >
            <img
              className="object-cover rounded-[2px] w-[5vw] h-[5vw]"
              src={vid.thumbnail}
            />
            {buttonOnThumbnail && (
              <div
                className="absolute z-[1] bg-black/40 w-[5vw] h-[5vw] top-[0] right-[0] hover:cursor-pointer"
                onClick={async () => await playHandler(songState, data)}
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
          <h1>{vid.title}</h1>

          <h1 className="text-sm">{owner.title}</h1>
          <p className="text-sm mt-[1vh]">{formatSongDuration(vid.duration)}</p>
        </span>
      </span>
      <span className="flex flex-row gap-4 justify-center items-center w-[20vw] h-[12vh]">
        <span onClick={() => setLiked((p) => !p)} className="hover:scale-110">
          {liked ? heartFill("#ffffff") : heartNoFill}
        </span>
        <span
          //type="button"
          className="flex items-center justify-center relative rounded-full hover:cursor-pointer"
          onClick={(e) => {
            setDropdownPos({
              left: `${e.clientX - 20}px`,
              top: `${e.clientY - 20}px`,
            });
            toggleDropdown();
          }}
        >
          <img
            className="w-[1.5vw] h-[1.5vw] hover:scale-110"
            src="/icons/dots_vertical.svg"
          ></img>
        </span>
        {dropdownItemId && dropdownItemId.get === data.vid.id && (
          <div
            className="absolute z-[1] rounded-[4px] w-[10vw] h-[10vw]"
            style={{
              background: dropdownMenuBg,
              left: dropdownPos.left,
              top: dropdownPos.top,
            }}
          >
            <div className="flex flex-col items-between justify-center w-[10vw] h-[10vw] whitespace-nowrap overflow-y-hidden divide-y">
              <span
                className="flex items-center justify-start h-[5vh] hover:bg-white/20"
                onClick={async () => await playHandler(songState, data)}
              >
                <h1 className="">Play</h1>
              </span>
              <span
                className="flex items-center justify-start h-[5vh] hover:bg-white/20"
                onClick={async () => await queueAddHandler(data)}
              >
                Add to queue
              </span>
              <span
                className="flex items-center justify-start h-[5vh] hover:bg-white/20"
                onClick={() => alert("This doesn't do anything rn")}
                onMouseOver={() => setPlaylistDropdown(true)}
                onMouseOut={() => setPlaylistDropdown(false)}
              >
                Add to playlist
                {playlistDropdown && (
                  <div
                    className="absolute z-[2] left-[75%] top-[75%] rounded-[4px] w-[12vw] h-[10vw]"
                    style={{
                      background: dropdownMenuBg,
                    }}
                  >
                    <div className="flex flex-col items-between justify-center w-[12vw] h-[10vw] whitespace-nowrap overflow-y-hidden divide-y">
                      <span className="flex items-center justify-start h-[5vh] hover:bg-white/20">
                        <p>{"You don't have any."}</p>
                      </span>
                    </div>
                  </div>
                )}
              </span>
            </div>
          </div>
        )}
      </span>
    </div>
  );
}

export const playHandler = async (
  songState: StateManager<SongData | null>,
  data: SongData
) => {
  songState.set(data);

  const historyArray = await queueDB.history.toArray();
  const duplicate = historyArray.find((song) => song.vid.id === data.vid.id);
  if (duplicate) {
    await queueDB.history.where("vid.id").equals(data.vid.id).delete();
  }

  await queueDB.history.add(data);
};

export const queueAddHandler = async (data: SongData) => {
  await queueDB.queue.add(data);
};
