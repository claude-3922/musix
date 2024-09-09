/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from "@/util/format";
import { pSBC } from "@/util/pSBC";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import Dropdown, { DropdownPos, toggleDropdown } from "../../Util/Dropdown";
import OverlayIcon from "../../Util/OverlayIcon";
import { AlbumData } from "@/util/types/AlbumData";
import { ArtistData } from "@/util/types/ArtistData";
import { enqueue, play } from "@/player/manager";
import { loadingSpinner } from "../../Player/Controls";
import { COLORS } from "@/util/enums/colors";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";

interface TopResultProps {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
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
  const [addedToQueue, setAddedToQueue] = useState(false);
  const [isNp, setIsNp] = useState(false);

  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    async function init() {
      if (songState.get && songState.get.id === data.id) {
        setIsNp(true);
      } else {
        setIsNp(false);
      }
    }
    init();
  }, [data.id, songState]);

  useLiveQuery(async () => {
    const queueArray = await queueDB.queue.toArray();

    if (queueArray.find((s) => s.id === data.id)) {
      setAddedToQueue(true);
    }
  });

  let currentItemId: string | null = null;

  switch (type) {
    case "SONG":
      currentItemId = (data as SongData).id;
      break;
    case "VIDEO":
      currentItemId = (data as SongData).id;
    case "ARTIST":
      currentItemId = (data as ArtistData).id;
      break;
    case "ALBUM":
      currentItemId = (data as AlbumData).id;
      break;
    case "PLAYLIST":
      currentItemId = (data as PlaylistMetadata).id;
      break;
    default:
      break;
  }

  const handlePlay = async () => {
    if (type === "ARTIST") return;
    setWaiting(true);

    if (type === "SONG" || type === "VIDEO") {
      await play(songState, data as SongData);
      setWaiting(false);
      return;
    }

    const songs = await fetchSongs(type, data.id);
    if (songs.length === 0) return setWaiting(false);

    await play(songState, songs[0]);
    for (const song of songs.slice(1)) {
      await enqueue(song);
    }

    setWaiting(false);
  };

  const handleEnqueue = async () => {
    if (type === "ARTIST") return;
    setWaiting(true);

    if (type === "SONG" || type === "VIDEO") {
      await enqueue(data as SongData);
      setWaiting(false);
      return;
    }

    const songs = await fetchSongs(type, data.id);
    for (const song of songs) {
      await enqueue(song);
    }

    setWaiting(false);
  };

  return (
    <div
      className="flex justify-start items-center rounded-[4px] h-[18vh] w-[80vw] bg-white/10 mx-[1vw]"
      onContextMenu={(e) => {
        dropdownPos.set({
          x: e.clientX - 20,
          y: e.clientY - 20,
        });
        toggleDropdown(currentItemId as any, dropdownId);
      }}
    >
      <OverlayIcon
        thumbnailURL={data.thumbnail}
        width={"8vw"}
        height={"8vw"}
        iconStyle={{
          borderRadius: "4px",
          overflow: "hidden",
          margin: "0vw 1vw",
        }}
        onClick={async () => {
          if (isNp) return;
          await handlePlay();
        }}
      >
        {waiting ? (
          loadingSpinner("3.5vw", "3.5vw")
        ) : (
          <img
            src="/icons/playFill.svg"
            style={{ width: "3.5vw", height: "3.5vw", opacity: 0.8 }}
          />
        )}
      </OverlayIcon>

      <span className="grow ">
        <span className="text-sm text-nowrap opacity-50">
          <h1>{`${type} • ${
            (type === "SONG" || type === "VIDEO") &&
            formatSongDuration((data as SongData).duration)
          }`}</h1>
        </span>
        <span>
          <h1 className="text-lg">
            {type === "SONG" || type === "VIDEO"
              ? (data as SongData).title
              : (data as AlbumData | ArtistData | PlaylistMetadata).name}
          </h1>
          <h1 className="">
            {type === "SONG" || type === "VIDEO" || type === "ALBUM"
              ? (data as SongData | AlbumData).artist.name
              : type === "PLAYLIST" && (data as PlaylistMetadata).owner.name}
          </h1>
        </span>
      </span>

      <span className="flex justify-end items-center gap-2 w-[38.5ch] mr-[1vw]">
        <button
          className="rounded-full px-[1vw] py-[0.5vh] hover:ring ring-accentColor/50"
          onClick={async () => {
            if (isNp) return;
            await handlePlay();
          }}
          disabled={waiting}
          style={{
            opacity: waiting || isNp ? 0.5 : 1,
            backgroundColor: COLORS.ACCENT,
          }}
        >
          {isNp ? "Already playing" : "Play"}
        </button>
        <button
          className="rounded-full px-[1vw] py-[0.5vh] hover:ring ring-accentColor/50"
          onClick={async () => {
            await handleEnqueue();
            setAddedToQueue(true);
          }}
          disabled={addedToQueue || waiting}
          style={{
            opacity: waiting || addedToQueue ? 0.5 : 1,
            backgroundColor: COLORS.ACCENT,
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
            toggleDropdown(currentItemId as any, dropdownId);
          }}
        >
          <img
            className="w-[1.5vw] h-[1.5vw] hover:scale-110"
            src="/icons/dots_vertical.svg"
          ></img>
        </span>
      </span>
    </div>
  );
}

const fetchSongs = async (
  type: "ALBUM" | "PLAYLIST",
  id: string
): Promise<SongData[]> => {
  const endpoint =
    type === "ALBUM" ? `/data/album?id=${id}` : `/data/playlist/items?id=${id}`;
  const res = await fetch(endpoint);

  if (res.status === 200) {
    const data = await res.json();
    return type === "ALBUM" ? (data.songs as SongData[]) : (data as SongData[]);
  }

  return [];
};
