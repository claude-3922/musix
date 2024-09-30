/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from "@/util/format";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import OverlayIcon from "../../Util/OverlayIcon";
import {
  Explcit,
  LoadingSpinner,
  Minus,
  MoreVertical,
  PauseSymbol,
  PlaySymbol,
  Plus,
} from "../../Icons/Icons";
import useAuth from "@/app/hooks/Auth";

interface SongProps {
  data: SongData;
  songState: StateManager<SongData | null>;
  audioPlayer: HTMLAudioElement | null;
}

export default function Song({ data, songState, audioPlayer }: SongProps) {
  const [addedToQueue, setAddedToQueue] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [playerPaused, setPlayerPaused] = useState(false);
  const [isNowPlaying, setIsNowPlaying] = useState(false);
  const [itemHovered, setItemHovered] = useState(false);

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
  }, [audioPlayer, data, songState.get?.id]);

  const handlePlay = () => {
    setWaiting(true);
    songState.set(data);

    setWaiting(false);
  };

  const handleEnqueue = () => {
    setWaiting(true);
    setWaiting(false);
  };

  const handleDequeue = () => {
    setWaiting(true);
    setWaiting(false);
  };

  const user = useAuth();

  return (
    <div
      className="flex items-center justify-start h-[25%] w-full bg-white/[5%] snap-always snap-start"
      onMouseOver={() => setItemHovered(true)}
      onMouseOut={() => setItemHovered(false)}
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
            handlePlay();
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
        {itemHovered && (
          <span className="flex items-center justify-center w-[40%] gap-2">
            <button
              className="rounded-full bg-accentColor p-1 hover:ring ring-accentColor/50"
              onClick={async () => {
                if (!isNowPlaying) {
                  handlePlay();
                } else {
                  playerPaused ? audioPlayer?.play() : audioPlayer?.pause();
                }
              }}
            >
              {waiting ? (
                <LoadingSpinner size={"24px"} fill={"#e8eaed"} />
              ) : isNowPlaying && !playerPaused ? (
                <PauseSymbol size={"24px"} fill={"#e8eaed"} />
              ) : (
                <PlaySymbol size={"24px"} fill={"#e8eaed"} />
              )}
            </button>
            <button
              className="rounded-full bg-accentColor p-1 disabled:ring-0 hover:ring ring-accentColor/50"
              disabled={!Boolean(user)}
              onClick={async () => {
                if (addedToQueue) {
                  handleDequeue();
                  setAddedToQueue(false);
                } else {
                  handleEnqueue();
                  setAddedToQueue(true);
                }
              }}
            >
              {waiting ? (
                <LoadingSpinner size={"24px"} fill={"#e8eaed"} />
              ) : addedToQueue ? (
                <Minus size={"24px"} fill={"#e8eaed"} />
              ) : (
                <Plus size={"24px"} fill={"#e8eaed"} />
              )}
            </button>
          </span>
        )}

        <span className="flex items-center justify-center w-[18%] text-sm opacity-50">
          {formatSongDuration(data.duration)}
        </span>

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
