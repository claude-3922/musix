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
import { dequeue, enqueue, play } from "@/player/manager";
import { COLORS } from "@/util/enums/colors";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";
import {
  LoadingSpinner,
  Minus,
  MoreVertical,
  PauseSymbol,
  PlaySymbol,
  Plus,
} from "../../Icons/Icons";

interface TopResultProps {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
  songState: StateManager<SongData | null>;
}

export default function TopResult({ type, data, songState }: TopResultProps) {
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

  const handleDequeue = async () => {
    if (type === "ARTIST") return;
    setWaiting(true);

    if (type === "SONG" || type === "VIDEO") {
      await dequeue(data as SongData);
      setWaiting(false);
      return;
    }

    const songs = await fetchSongs(type, data.id);
    for (const song of songs) {
      await dequeue(song);
    }

    setWaiting(false);
  };

  return (
    <div
      className="flex justify-start items-center h-[21%] w-full bg-white/[5%]"
      onContextMenu={(e) => {}}
    >
      <OverlayIcon
        optionalYoutubeId={data.id}
        thumbnailURL={data.thumbnail}
        width={"8vw"}
        height={"8vw"}
        iconStyle={{
          overflow: "hidden",
          margin: "1vw",
        }}
        onClick={async () => {
          if (isNp) return;
          await handlePlay();
        }}
      >
        {waiting ? (
          <LoadingSpinner size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        ) : (
          <PlaySymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        )}
      </OverlayIcon>

      <span className="grow max-w-[60%]">
        <span className="text-sm whitespace-nowrap text-ellipsis opacity-50 w-full">
          <h1>{`${type} • ${
            (type === "SONG" || type === "VIDEO") &&
            formatSongDuration((data as SongData).duration)
          }`}</h1>
        </span>
        <span>
          <h1 className="text-lg whitespace-nowrap text-ellipsis w-full">
            {type === "SONG" || type === "VIDEO"
              ? (data as SongData).title
              : (data as AlbumData | ArtistData | PlaylistMetadata).name}
          </h1>
          <h1 className="text-base whitespace-nowrap text-ellipsis w-full">
            {type === "SONG" || type === "VIDEO" || type === "ALBUM"
              ? (data as SongData | AlbumData).artist.name
              : type === "PLAYLIST" && (data as PlaylistMetadata).owner.name}
          </h1>
        </span>
      </span>

      <span className="flex justify-end items-center gap-2 min-w-[35%] max-w-[50%] h-full">
        <button
          className="text-base rounded-full px-[1vw] py-[0.5vh] hover:ring ring-accentColor/50 disabled:ring-0 whitespace-nowrap text-ellipsis overflow-hidden"
          onClick={async () => {
            if (isNp) return;
            await handlePlay();
          }}
          disabled={waiting || isNp}
          style={{
            opacity: waiting || isNp ? 0.5 : 1,
            backgroundColor: COLORS.ACCENT,
          }}
        >
          {isNp ? (
            <span className="flex items-center justify-center gap-2">
              <PauseSymbol size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Playing</p>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <PlaySymbol size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Play</p>
            </span>
          )}
        </button>
        <button
          className="text-base rounded-full px-[1vw] py-[0.5vh] hover:ring ring-accentColor/50 disabled:ring-0 whitespace-nowrap text-ellipsis overflow-hidden"
          onClick={async () => {
            if (addedToQueue) {
              await handleDequeue();
              setAddedToQueue(false);
            } else {
              await handleEnqueue();
              setAddedToQueue(true);
            }
          }}
          disabled={waiting}
          style={{
            opacity: waiting ? 0.5 : 1,
            backgroundColor: COLORS.ACCENT,
          }}
        >
          {addedToQueue ? (
            <span className="flex items-center justify-center gap-2">
              <Minus size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Remove from queue</p>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Plus size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Add to queue</p>
            </span>
          )}
        </button>
        <span
          //type="button"
          className="w-[10%] h-[20%] flex items-center justify-center relative hover:cursor-pointer hover:scale-110"
        >
          <MoreVertical size={"90%"} opacity={0.8} />
        </span>
      </span>
    </div>
  );
}

const topResultDropdown = <div></div>;

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
