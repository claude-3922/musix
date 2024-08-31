import { queueDB } from "@/db/queueDB";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import SearchItemSong from "../SearchResults/SearchItem/Song";
import ExpandableList from "../Util/ExpandableList";

interface MainProps {
  songState: StateManager<SongData | null>;
}

export default function Main({ songState }: MainProps) {
  const queue = useLiveQuery(() => queueDB.queue.toArray());

  const [queueItemContainerExpand, setQueueItemContainerExpand] =
    useState(false);

  return (
    <div className="flex items-start bg-custom_black rounded-[4px] justify-center w-[100vw] h-[80.5vh] my-[1vh] overflow-y-scroll">
      <div
        className={`videoContainer flex flex-col w-[100vw] h-[100vh] mt-[2vh] overflow:hidden bg-black/20`}
      >
        <div className="font-bold mx-[2vw] my-[4vh]">
          <h1 className="text-5xl">Welcome, {"user"}</h1>
        </div>

        <div className="mx-[4vw] my-[1vh]">
          <h1 className="text-2xl">Up Next</h1>
        </div>

        <ExpandableList
          beforeCount={1}
          afterCount={queue?.length || 0}
          beforeHeight="13vh"
          afterHeight={`${queue ? queue.length * 13 : 13}vh`}
          customExpandButtonProps={{
            className:
              "w-[8vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
          }}
        >
          {queue ? (
            queue.map((s, i) => (
              <SearchItemSong
                key={i}
                data={s}
                songState={songState}
                dropdownItemId={null as any}
              />
            ))
          ) : (
            <p>NONE</p>
          )}
        </ExpandableList>
      </div>
    </div>
  );
}
