/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from "@/util/format";
import { pSBC } from "@/util/pSBC";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useState } from "react";
import Dropdown, { DropdownPos, toggleDropdown } from "../../Util/Dropdown";
import OverlayIcon from "../../Util/OverlayIcon";
import { AlbumData } from "@/util/types/AlbumData";
import { ArtistData } from "@/util/types/ArtistData";
import { enqueue, play } from "@/player/manager";
import { loadingSpinner } from "../../Player/Controls";
import { COLORS } from "@/util/enums/colors";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";

interface SongProps {
  data: SongData;
  songState: StateManager<SongData | null>;

  dropdownId: StateManager<string | null>;
  dropdownPos: StateManager<DropdownPos>;
}

export default function Song({
  data,
  songState,

  dropdownId,
  dropdownPos,
}: SongProps) {
  const [addedToQueue, setAddedToQueue] = useState(false);
  const [isNp, setIsNp] = useState(false);

  const [waiting, setWaiting] = useState(false);

  useLiveQuery(async () => {
    const queueArray = await queueDB.queue.toArray();
    const np = await queueDB.getNowPlaying();

    if (queueArray.find((s) => s.id === data.id)) {
      setAddedToQueue(true);
    }
    if (np && np.id === data.id) {
      setIsNp(true);
    }
  });

  let currentItemId: string = data.id;

  const handlePlay = async () => {
    await play(songState, data);

    setWaiting(false);
  };

  const handleEnqueue = async () => {
    await enqueue(data as SongData);
    setWaiting(false);
  };

  return (
    <div
      className="flex items-center rounded-[4px] h-[12vh] w-[80vw] bg-white/10 mx-[1vw] my-[1vh]"
      onContextMenu={(e) => {
        dropdownPos.set({
          x: e.clientX - 20,
          y: e.clientY - 20,
        });
        toggleDropdown(currentItemId, dropdownId);
      }}
    >
      <OverlayIcon
        thumbnailURL={data.thumbnail}
        width={"5vw"}
        height={"5vw"}
        iconStyle={{
          borderRadius: "4px",
          overflow: "hidden",
          margin: "0vw 1vw",
        }}
        onClick={async () => await handlePlay()}
      >
        {waiting ? (
          loadingSpinner("2.5vw", "2.5vw")
        ) : (
          <img
            src="/icons/playFill.svg"
            style={{ width: "2.5vw", height: "2.5vw", opacity: 0.8 }}
          />
        )}
      </OverlayIcon>

      <span className="flex flex-col gap-2 items-start justify-center">
        <span>
          <h1>{data.title}</h1>
          <h1 className="text-sm">{data.artist.name}</h1>
        </span>

        <h1 className="text-sm opacity-50">
          {formatSongDuration(data.duration)}
        </h1>
      </span>
    </div>
  );
}
