import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import { useLiveQuery } from "dexie-react-hooks";
import React from "react";

interface MainProps {
  songState: StateManager<SongData | null>;
}

export default function Main({ songState }: MainProps) {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-y-scroll">
      <span className="text-3xl opacity-40">Main Page</span>
    </div>
  );
}
