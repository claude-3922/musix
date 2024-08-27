/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { queueDB } from "@/db/queueDB";
import { formatSongDuration } from "@/util/format";
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React from "react";

interface ItemProps {
  data: SongData;
  songState: StateManager<SongData | null>;
  playerState: StateManager<boolean>;
}

export default function Item({ data, songState, playerState }: ItemProps) {
  const { vid, owner, playerInfo } = data;

  return (
    <div className="flex justify-between items-center w-[70vw] h-[12vh] rounded-xl mb-[1vh] mx-[1vw] bg-custom_gray/20">
      <span className="flex justify-start items-center">
        <span className="flex flex-col justify-center items-center w-[8vw] h-[12vh]">
          <img
            className="object-cover rounded-[2px] w-[4vw] h-[4vw]"
            src={vid.thumbnail}
          ></img>
          <p className="text-sm mt-[0.25vh]">
            {formatSongDuration(vid.duration)}
          </p>
        </span>
        <span className="flex flex-col items-start justify-center w-[45vw] h-[12vh] overflow-hidden whitespace-nowrap">
          <h1>{vid.title}</h1>
          <h1>{owner.title}</h1>
        </span>
      </span>
      <span className="flex flex-col justify-center items-center w-[20vw] h-[12vh]">
        <button
          className="text-sm border-2 rounded-[4px] px-[0.25vw] py-[0.25vh] mb-[0.25vh] bg-custom_d_gray"
          onClick={async () => {
            songState.set(data);
            playerState.set(true);

            const historyArray = await queueDB.history.toArray();
            const duplicate = historyArray.find(
              (song) => song.vid.id === data.vid.id
            );
            if (duplicate) {
              await queueDB.history
                .where("vid.id")
                .equals(data.vid.id)
                .delete();
            }

            await queueDB.history.add(data);
          }}
        >
          PLAY
        </button>
        <button
          className="text-sm border-2 rounded-[4px] px-[0.25vw] py-[0.25vh] bg-custom_d_gray"
          onClick={async () => {
            await queueDB.queue.add(data);
          }}
        >
          ADD TO QUEUE
        </button>
      </span>
    </div>
  );
}
