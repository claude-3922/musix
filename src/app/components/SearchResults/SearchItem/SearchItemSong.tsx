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
import Dropdown, { DropdownPos } from "../../Util/Dropdown";
import { toggleDropdown } from "../../Util/Dropdown";
import OverlayIcon from "../../Util/OverlayIcon";

interface SearchItemSongProps {
  data: SongData;
  songState: StateManager<SongData | null>;

  dropdownId: StateManager<string | null>;
  dropdownPos: StateManager<DropdownPos>;
}

export default function SearchItemSong({
  data,
  songState,
  dropdownId,
  dropdownPos,
}: SearchItemSongProps) {
  const { vid, owner } = data;

  const [liked, setLiked] = useState(false);

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
        toggleDropdown(
          e.clientX - 20,
          e.clientY - 20,
          data.vid.id,
          dropdownId,
          dropdownPos
        );
      }}
    >
      <span className="flex justify-start items-center">
        <OverlayIcon
          thumbnailURL={vid.thumbnail}
          width={"5vw"}
          height={"5vw"}
          iconStyle={{
            borderRadius: "4px",
            overflow: "hidden",
            margin: "0vw 1vw",
          }}
          onClick={async () => {
            await playHandler(songState, data as SongData);
          }}
        >
          <img
            src="/icons/playFill.svg"
            style={{ width: "2.5vw", height: "2.5vw", opacity: 0.8 }}
          />
        </OverlayIcon>

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
            toggleDropdown(
              e.clientX - 20,
              e.clientY - 20,
              data.vid.id,
              dropdownId,
              dropdownPos
            );
          }}
        >
          <img
            className="w-[1.5vw] h-[1.5vw] hover:scale-110"
            src="/icons/dots_vertical.svg"
          ></img>
        </span>
        <Dropdown
          id={dropdownId.get || undefined}
          pos={dropdownPos.get}
          dropdownStyle={{ background: dropdownMenuBg }}
          width={"10vw"}
          height={"8vw"}
        ></Dropdown>
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
