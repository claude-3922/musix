import { queueDB } from "@/db/queueDB";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";

import ExpandableList from "../Util/ExpandableList";
import SeekBar from "../Util/SeekBar";

interface MainProps {
  songState: StateManager<SongData | null>;
}

export default function Main({ songState }: MainProps) {
  const queue = useLiveQuery(() => queueDB.queue.toArray());

  return (
    <div className="flex items-start justify-center w-full h-full overflow-y-scroll">
      <div className={`flex flex-col w-full h-full overflow:hidden`}>
        <div className="font-bold">
          <h1 className="text-5xl">Welcome, {"user"}</h1>
        </div>

        <div>
          <h1 className="text-2xl">SKIBIDI SIGMA Fanum Tax baby gronk</h1>
        </div>
      </div>
    </div>
  );
}
