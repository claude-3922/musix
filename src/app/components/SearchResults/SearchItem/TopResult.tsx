/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from "@/util/format";
import { pSBC } from "@/util/pSBC";
import { ChannelMetadata } from "@/util/types/ChannelMetadata";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useState } from "react";
import { playHandler, queueAddHandler } from "./SearchItemSong";
import Dropdown, { DropdownPos, toggleDropdown } from "../../Util/Dropdown";
import OverlayIcon from "../../Util/OverlayIcon";

interface TopResultProps {
  type: "video" | "playlist" | "channel";
  data: SongData | PlaylistMetadata | ChannelMetadata;
  songState: StateManager<SongData | null>;

  dropdownId: StateManager<string | null>;
  dropdownPos: StateManager<DropdownPos>;
}

export default function TopResult({
  type,
  data,
  songState,

  dropdownId,
  dropdownPos,
}: TopResultProps) {
  const [playlistDropdown, setPlaylistDropdown] = useState(false);
  const [addedToQueue, setAddedToQueue] = useState(false);

  const currentItemId =
    type === "video"
      ? (data as SongData).vid.id
      : (data as PlaylistMetadata | ChannelMetadata).id;

  const currentItemThumbanailURL =
    type === "video"
      ? (data as SongData).vid.thumbnail
      : (data as PlaylistMetadata | ChannelMetadata).thumbnail || "";

  return (
    <div
      className="flex items-center rounded-[4px] h-[20vh] w-[80vw] bg-white/10 mx-[1vw] "
      onContextMenu={(e) => {
        dropdownPos.set({
          x: e.clientX - 20,
          y: e.clientY - 20,
        });
        toggleDropdown(currentItemId, dropdownId);
      }}
    >
      <OverlayIcon
        thumbnailURL={currentItemThumbanailURL}
        width={"15vw"}
        height={"15vh"}
        iconStyle={{
          borderRadius: "4px",
          overflow: "hidden",
          margin: "0vw 1vw",
        }}
        onClick={async () => {
          if (type === "video") {
            await playHandler(songState, data as SongData);
          }
        }}
      >
        <img
          src="/icons/playFill.svg"
          style={{ width: "4vw", height: "4vw", opacity: 0.8 }}
        />
      </OverlayIcon>

      <span className="flex flex-col gap-4 items-start justify-center">
        <span>
          <h1 className="text-lg w-[60ch] overflow-hidden whitespace-nowrap">
            {type === "video"
              ? (data as SongData).vid.title
              : (data as PlaylistMetadata | ChannelMetadata).title}
          </h1>
          {type === "channel" ? (
            <></>
          ) : (
            <h1 className="text-base w-[60ch] overflow-hidden whitespace-nowrap">
              {(data as SongData | PlaylistMetadata).owner.title}
            </h1>
          )}
        </span>

        <span className="flex justify-center items-center gap-8">
          <span className="flex justify-center items-center gap-2">
            <button
              className="rounded-full border-2 px-[1vw] py-[0.5vh] hover:bg-white/20"
              onClick={async () => {
                if (type === "video")
                  await playHandler(songState, data as SongData);
              }}
            >
              Play
            </button>
            <button
              className="rounded-full border-2 px-[1vw] py-[0.5vh] hover:bg-white/20"
              onClick={async () => {
                if (type === "video") {
                  await queueAddHandler(data as SongData);
                  setAddedToQueue(true);
                }
              }}
            >
              {addedToQueue ? "Added to queue" : "Add to queue"}
            </button>
            <span
              //type="button"
              className="flex items-center justify-center relative rounded-full hover:cursor-pointer"
              onClick={(e) => {
                dropdownPos.set({
                  x: e.clientX - 20,
                  y: e.clientY - 20,
                });
                toggleDropdown(currentItemId, dropdownId);
              }}
            >
              <img
                className="w-[1.5vw] h-[1.5vw] hover:scale-110"
                src="/icons/dots_vertical.svg"
              ></img>
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
