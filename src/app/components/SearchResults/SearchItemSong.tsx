/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { queueDB } from "@/db/queueDB";
import { formatSongDuration } from "@/util/format";
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useState } from "react";

interface SearchItemSongProps {
  data: SongData;
  songState: StateManager<SongData | null>;
  playerState: StateManager<boolean>;
  dropdownState: StateManager<boolean>;
}

export default function SearchItemSong({
  data,
  songState,
  playerState,
  dropdownState,
}: SearchItemSongProps) {
  const { vid, owner, playerInfo } = data;

  const [buttonOnThumbnail, setButtonOnThumbnail] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const playHandler = async () => {
    songState.set(data);
    playerState.set(true);

    const historyArray = await queueDB.history.toArray();
    const duplicate = historyArray.find((song) => song.vid.id === data.vid.id);
    if (duplicate) {
      await queueDB.history.where("vid.id").equals(data.vid.id).delete();
    }

    await queueDB.history.add(data);
  };

  const queueAddHandler = async () => {
    await queueDB.queue.add(data);
  };

  return (
    <div className="flex justify-between items-center w-[80vw] h-[12vh] rounded-xl mb-[1vh] mx-[1vw] bg-custom_gray/20">
      <span
        className="flex justify-start items-center"
        onMouseOver={() => setButtonOnThumbnail(true)}
        onMouseOut={() => setButtonOnThumbnail(false)}
      >
        <span className="flex flex-col justify-center items-center w-[8vw] h-[12vh]">
          <span className="relative">
            <img
              className="object-cover rounded-[2px] w-[5vw] h-[5vw]"
              src={vid.thumbnail}
            />
            {buttonOnThumbnail && (
              <div
                className="absolute z-[1] bg-black/40 w-[5vw] h-[5vw] top-[0] right-[0] hover:cursor-pointer"
                onClick={playHandler}
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
      <span className="flex flex-col justify-center items-center w-[20vw] h-[12vh]">
        <button
          className="relative hover:bg-black/20 rounded-full w-[3vw] h-[3vw]"
          onClick={() => {}}
        ></button>
      </span>
    </div>
  );
}
