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

interface TopResultProps {
  type: "video" | "playlist" | "channel";
  data: SongData | PlaylistMetadata | ChannelMetadata;
  dropdownItemId: StateManager<string | null>;
  songState: StateManager<SongData | null>;
}

export default function TopResult({
  type,
  data,
  dropdownItemId,
  songState,
}: TopResultProps) {
  const [dropdownPos, setDropdownPos] = useState({ left: "0px", top: "0px" });
  const [playlistDropdown, setPlaylistDropdown] = useState(false);
  const [addedToQueue, setAddedToQueue] = useState(false);

  const currentItemId =
    type === "video"
      ? (data as SongData).vid.id
      : (data as PlaylistMetadata | ChannelMetadata).id;

  const toggleDropdown = () => {
    if (dropdownItemId && dropdownItemId.get === currentItemId) {
      dropdownItemId.set(null);
    } else {
      dropdownItemId.set(currentItemId);
    }
  };

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
      className="flex items-center rounded-[4px] h-[20vh] w-[80vw] bg-white/10 mx-[1vw] "
      onContextMenu={(e) => {
        setDropdownPos({
          left: `${e.clientX - 20}px`,
          top: `${e.clientY - 20}px`,
        });

        toggleDropdown();
      }}
    >
      <span className="relative w-[15vw] h-[15vh] rounded-[4px] overflow-hidden mx-[1vw]">
        {type === "video" ? (
          <img
            className="w-[15vw] h-[15vh] rounded-[4px] object-cover"
            src={(data as SongData).vid.thumbnail}
          ></img>
        ) : type === "playlist" ? (
          <img
            className="w-[15vw] h-[15vh] rounded-[4px] object-cover"
            src={(data as PlaylistMetadata).thumbnail}
          ></img>
        ) : (
          <img
            className="w-[15vw] h-[15vh] rounded-[4px] object-cover"
            src={(data as ChannelMetadata).thumbnail}
          ></img>
        )}
        {type === "video" && (
          <p className="absolute z-[1] right-[0%] bottom-[0%] text-sm bg-black/80 px-[0.5vw] py-[0.25vh]  text-white/90">
            {formatSongDuration((data as SongData).vid.duration)}
          </p>
        )}
      </span>
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
                setDropdownPos({
                  left: `${e.clientX - 20}px`,
                  top: `${e.clientY - 20}px`,
                });
                toggleDropdown();
              }}
            >
              <img
                className="w-[1.5vw] h-[1.5vw] hover:scale-110"
                src="/icons/dots_vertical.svg"
              ></img>
            </span>
            {dropdownItemId && dropdownItemId.get === currentItemId && (
              <div
                className="absolute z-[1] rounded-[4px] w-[10vw] h-[10vw]"
                style={{
                  background: dropdownMenuBg,
                  left: dropdownPos.left,
                  top: dropdownPos.top,
                }}
              >
                <div className="flex flex-col items-between justify-center w-[10vw] h-[10vw] whitespace-nowrap overflow-y-hidden divide-y">
                  <span
                    className="flex items-center justify-start h-[5vh] hover:bg-white/20"
                    onClick={async () => {
                      if (type === "video")
                        await playHandler(songState, data as SongData);
                    }}
                  >
                    <h1 className="">Play</h1>
                  </span>
                  <span
                    className="flex items-center justify-start h-[5vh] hover:bg-white/20"
                    onClick={async () => {
                      if (type === "video") {
                        await queueAddHandler(data as SongData);
                        setAddedToQueue(true);
                      }
                    }}
                  >
                    {addedToQueue ? "Added to queue" : "Add to queue"}
                  </span>
                  <span
                    className="flex items-center justify-start h-[5vh] hover:bg-white/20"
                    onClick={() => alert("This doesn't do anything rn")}
                    onMouseOver={() => setPlaylistDropdown(true)}
                    onMouseOut={() => setPlaylistDropdown(false)}
                  >
                    Add to playlist
                    {playlistDropdown && (
                      <div
                        className="absolute z-[2] left-[75%] top-[75%] rounded-[4px] w-[12vw] h-[10vw]"
                        style={{
                          background: dropdownMenuBg,
                        }}
                      >
                        <div className="flex flex-col items-between justify-center w-[12vw] h-[10vw] whitespace-nowrap overflow-y-hidden divide-y">
                          <span className="flex items-center justify-start h-[5vh] hover:bg-white/20">
                            <p>{"You don't have any."}</p>
                          </span>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            )}
          </span>
        </span>
      </span>
    </div>
  );
}
