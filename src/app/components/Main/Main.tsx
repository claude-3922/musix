import { queueDB } from "@/db/queueDB";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";

import SeekBar from "../Util/SeekBar";

interface MainProps {
  songState: StateManager<SongData | null>;
}

export default function Main({ songState }: MainProps) {
  const queue = useLiveQuery(() => queueDB.queue.toArray());

  return (
    <div className="flex items-center justify-center w-full h-full overflow-y-scroll">
      <span className="text-3xl opacity-40">Main Page</span>
    </div>
  );
}
