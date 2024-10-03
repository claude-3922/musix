/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Controls from "./Controls";
import Extras from "./Extras";
import { pSBC } from "@/util/pSBC";
import { StateManager } from "@/util/types/StateManager";
import useStateManager from "@/app/hooks/StateManager";
import { COLORS } from "@/util/enums/colors";
import OverlayIcon from "../Util/OverlayIcon";
import { Chevron_0Deg } from "../Icons/Icons";
import { SongData } from "@/util/types/SongData";

interface PlayerProps {
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
  showPreview: StateManager<boolean>;
}

let mounted = false;

export function Player({ audioPlayer, songState, showPreview }: PlayerProps) {
  const data = songState.get;

  const [audioLoading, setAudioLoading] = useState(true);

  const playerTime = useStateManager<number>(0);
  const playerPaused = useStateManager<boolean>(false);

  const timeUpdateHandler = () => {
    playerTime.set(audioPlayer?.currentTime || 0);
  };

  const pauseHandler = () => {
    playerPaused.set(true);
  };

  const playHandler = () => {
    playerPaused.set(false);

    if (audioPlayer) {
      audioPlayer.volume = Number(
        JSON.parse(localStorage.getItem("volume") || "1")
      );
    }
  };

  const loadStartHandler = () => {
    setAudioLoading(true);
  };

  const waitingHandler = () => {
    setAudioLoading(true);
  };

  const playReadyHandler = () => {
    setAudioLoading(false);

    audioPlayer?.play();
  };

  const songEndedHandler = async () => {};

  useEffect(() => {
    if (!mounted) {
      mounted = true;

      audioPlayer?.load();
      audioPlayer
        ? (audioPlayer.volume = Number(
            JSON.parse(localStorage.getItem("volume") || "1")
          ))
        : null;
    }

    const videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLVideoElement;

    if (videoPlayer) {
      playerPaused.get ? videoPlayer.pause() : videoPlayer.play();
    }
  }, [audioPlayer, playerPaused.get]);

  if (!audioPlayer) {
    return (
      <div
        className={`no-select flex flex-row items-center justify-center w-full h-full`}
        style={{
          backgroundColor: `${pSBC(0.4, COLORS.BG, "#000000")}`,
        }}
      >
        <span className="text-2xl opacity-60">Nothing playing</span>
      </div>
    );
  } else if (!songState.get) {
    return null;
  }

  audioPlayer.addEventListener("loadstart", loadStartHandler);
  audioPlayer.addEventListener("canplay", playReadyHandler);
  audioPlayer.addEventListener("ended", songEndedHandler);
  audioPlayer.addEventListener("waiting", waitingHandler);
  audioPlayer.addEventListener("timeupdate", timeUpdateHandler);
  audioPlayer.addEventListener("pause", pauseHandler);
  audioPlayer.addEventListener("play", playHandler);

  return (
    <div
      className={`no-select flex flex-row items-center justify-evenly w-full h-full px-[1%]`}
      style={{
        backgroundColor: `${pSBC(0.4, COLORS.BG, "#000000")}`,
      }}
    >
      <div className="flex justify-start items-center w-[30%] h-full gap-2">
        <OverlayIcon
          thumbnailURL={songState.get.thumbnail}
          width={"16.5%"}
          height={"78%"}
          iconStyle={{
            overflow: "hidden",
          }}
          onClick={() => showPreview.set(!showPreview.get)}
        >
          <span
            className="w-[50%] h-[50%] opacity-100"
            style={{ rotate: showPreview.get ? "90deg" : "270deg" }}
          >
            <Chevron_0Deg size={"100%"} opacity={0.8} />
          </span>
        </OverlayIcon>

        <div className="flex flex-col items-start justify-center w-[45%] h-full overflow-x-hidden">
          {data && data.title.length > 21 ? (
            <span className="text-base overflow-hidden whitespace-nowrap animateTitle">
              {data.title}
            </span>
          ) : (
            <span className="text-base overflow-hidden whitespace-nowrap">
              {data?.title}
            </span>
          )}
          {data && data.artist.name.length > 21 ? (
            <span className="text-sm overflow-hidden whitespace-nowrap animateTitle">
              {data.artist.name}
            </span>
          ) : (
            <span className="text-sm overflow-hidden whitespace-nowrap">
              {data?.artist.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 justify-center grow h-full items-center">
        <Controls
          data={songState.get}
          songState={songState}
          audioPlayer={audioPlayer}
          playerTime={playerTime}
          playerPaused={playerPaused}
          playerLoading={audioLoading}
        />
      </div>

      <div className="flex items-center justify-end w-[30%] h-full gap-1">
        <Extras
          data={songState.get}
          audioPlayer={audioPlayer}
          showVolumeBar={true}
        />
      </div>
    </div>
  );
}
