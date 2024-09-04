import { queueDB } from "@/db/queueDB";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";
import SearchItemSong from "../SearchResults/SearchItem/Song";
import ExpandableList from "../Util/ExpandableList";
import SeekBar from "../Util/SeekBar";

interface MainProps {
  songState: StateManager<SongData | null>;
}

export default function Main({ songState }: MainProps) {
  const queue = useLiveQuery(() => queueDB.queue.toArray());

  return (
    <div className="flex items-start bg-custom_black justify-center w-[100vw] h-[83.25vh] overflow-y-scroll">
      <div
        className={`videoContainer flex flex-col w-[100vw] h-[100vh] mt-[2vh] overflow:hidden bg-black/20`}
      >
        <div className="font-bold mx-[2vw] my-[4vh]">
          <h1 className="text-5xl">Welcome, {"user"}</h1>
        </div>

        <div className="mx-[4vw] my-[1vh]">
          <h1 className="text-2xl">SKIBIDI SIGMA Fanum Tax baby gronk</h1>
        </div>
      </div>
    </div>
  );
}
