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

import { COLORS } from "@/util/enums/colors";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";
import {
  Explcit,
  LoadingSpinner,
  MoreVertical,
  PauseSymbol,
  PlayButton,
  PlaySymbol,
} from "../../Icons/Icons";

interface SongProps {
  data: SongData;
  songState: StateManager<SongData | null>;
  audioPlayer: HTMLAudioElement | null;
}

export default function Song({ data, songState, audioPlayer }: SongProps) {
  const [addedToQueue, setAddedToQueue] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [playerPaused, setPlayerPaused] = useState(false);
  const [isNowPlaying, setIsNowPlaying] = useState(false);

  useEffect(() => {
    if (!audioPlayer) return;

    setIsNowPlaying(songState.get?.id === data.id);

    const playHandler = () => {
      setPlayerPaused(false);
    };
    const pauseHandler = () => {
      setPlayerPaused(true);
    };

    audioPlayer.addEventListener("play", playHandler);
    audioPlayer.addEventListener("pause", pauseHandler);

    return () => {
      audioPlayer.removeEventListener("play", playHandler);
      audioPlayer.removeEventListener("pause", pauseHandler);
    };
  }, [audioPlayer, data.id, songState.get?.id]);

  useLiveQuery(async () => {
    const queueArray = await queueDB.queue.toArray();

    if (queueArray.find((s) => s.id === data.id)) {
      setAddedToQueue(true);
    }
  });

  const handlePlay = async () => {
    setWaiting(true);
    await play(songState, data);

    setWaiting(false);
  };

  const handleEnqueue = async () => {
    setWaiting(true);
    await enqueue(data as SongData);
    setWaiting(false);
  };

  return (
    <div
      className="flex items-center justify-start h-[25%] w-full bg-white/[5%]"
      onContextMenu={(e) => {}}
    >
      <OverlayIcon
        optionalYoutubeId={data.id}
        thumbnailURL={data.thumbnail}
        width={"5vw"}
        height={"5vw"}
        iconStyle={{
          overflow: "hidden",
          margin: "1%",
        }}
        onClick={async () => {
          if (!isNowPlaying) {
            await handlePlay();
          } else {
            playerPaused ? audioPlayer?.play() : audioPlayer?.pause();
          }
        }}
      >
        {waiting ? (
          <LoadingSpinner size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        ) : isNowPlaying && !playerPaused ? (
          <PauseSymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        ) : (
          <PlaySymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        )}
      </OverlayIcon>

      <span className="flex flex-col items-start justify-center grow whitespace-nowrap text-ellipsis max-w-[80%] overflow-hidden">
        <span className="flex items-center justify-start w-full h-[50%] gap-1">
          {data.title}
          {data.explicit && <Explcit size={"18px"} opacity={0.6} />}
        </span>
        <h1 className="text-sm">{data.artist.name}</h1>
      </span>
      <span className="flex items-center justify-end gap-2 min-w-[17%] max-w-[50%] h-full">
        <h1 className="text-sm opacity-50">
          {formatSongDuration(data.duration)}
        </h1>

        <span
          //type="button"
          className="flex items-center justify-center relative hover:cursor-pointer w-[20%] h-full hover:scale-110"
        >
          <MoreVertical size={"24px"} opacity={0.8} />
        </span>
      </span>
    </div>
  );
}
