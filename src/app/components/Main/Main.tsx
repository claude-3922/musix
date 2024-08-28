import { queueDB } from "@/db/queueDB";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";
import Item from "../SearchResults/SearchItemSong";

interface MainProps {
  songState: StateManager<SongData | null>;
  playerState: StateManager<boolean>;
}

export default function Main({ songState, playerState }: MainProps) {
  const queue = useLiveQuery(() => queueDB.queue.toArray());

  const [queueItemContainerExpand, setQueueItemContainerExpand] =
    useState(false);

  return (
    <div className="flex items-start bg-custom_black rounded-[4px] justify-center w-[100vw] h-[77.5vh] my-[2vh] overflow-y-scroll">
      <div
        className={`videoContainer flex flex-col w-[100vw] h-[100vh] mt-[2vh] overflow:hidden bg-black/20`}
      >
        <div className="font-bold mx-[2vw] my-[4vh]">
          <h1 className="text-5xl">Welcome, {"user"}</h1>
        </div>

        <div className="mx-[4vw] my-[1vh]">
          <h1 className="text-2xl">Up Next</h1>
        </div>

        <div
          className="mx-[4vw] my-[1vh] overflow-y-hidden"
          style={{
            height: queueItemContainerExpand
              ? `${queue ? queue.length * 13 : 12}vh`
              : "12vh",
            transition: "height 0.125s ease-in-out",
          }}
        >
          {queue ? (
            queue.map((s, i) => (
              <Item
                key={i}
                data={s}
                songState={songState}
                playerState={playerState}
              />
            ))
          ) : (
            <p>NONE</p>
          )}
        </div>

        <button
          type="button"
          className="w-[10vw] mx-[4vw] my-[1vh] text-lg px-[2vw] py-[1vh] border-2 rounded-full"
          onClick={() => setQueueItemContainerExpand((p) => !p)}
        >
          {queueItemContainerExpand ? "Hide All" : "Show All"}
        </button>
      </div>
    </div>
  );
}
