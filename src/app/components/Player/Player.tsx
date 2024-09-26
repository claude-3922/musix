/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Controls from "./Controls";
import Extras from "./Extras";
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import useStateManager from "@/app/hooks/StateManager";
import { COLORS } from "@/util/enums/colors";
import OverlayIcon from "../Util/OverlayIcon";
import { Chevron_0Deg } from "../Icons/Icons";

interface PlayerProps {
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
  showPreview: StateManager<boolean>;
}

export function Player({ audioPlayer, songState, showPreview }: PlayerProps) {
  const data = songState.get;

  const [songData, setSongData] = useState<SongData | null>(null);
  const [audioLoading, setAudioLoading] = useState(true);
  const [showVolumeBar, setShowVolumeBar] = useState(false);

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

  useEffect(() => {
    if (!data || !audioPlayer) return;

    const loadStartHandler = () => {
      setAudioLoading(true);
    };

    const waitingHandler = () => {
      setAudioLoading(true);
    };

    const playReadyHandler = () => {
      setAudioLoading(false);

      audioPlayer.play();
    };

    const songEndedHandler = async () => {
      // if (audioPlayer.loop) return;
      // const suggestionsRes = await fetch(`api/data/suggestions?id=${data.id}`);
      // const suggestions: SongData[] = await suggestionsRes.json();
      // if (suggestions.length > 0) {
      //   const songToPlay = suggestions[0];
      //   songState.set(songToPlay);
      //   queueManager.history.add(songToPlay);
      // }
      // const currentQueue = queueManager.queue.items;
      // if (currentQueue.length === 0) return;
      // const songToPlay = currentQueue[0];
      // if (!songToPlay) return;
      // songState.set(songToPlay);
      // queueManager.history.add(songToPlay);
      // queueManager.queue.remove(songToPlay);
    };

    const initPlayer = async (
      data: SongData,
      audioPlayer: HTMLAudioElement
    ) => {
      setSongData(data);
      // queueManager.nowPlaying.set(data);

      audioPlayer.load();
      audioPlayer.volume = Number(
        JSON.parse(localStorage.getItem("volume") || "1")
      );

      audioPlayer.addEventListener("loadstart", loadStartHandler);
      audioPlayer.addEventListener("canplay", playReadyHandler);
      audioPlayer.addEventListener("ended", songEndedHandler);
      audioPlayer.addEventListener("waiting", waitingHandler);
    };

    initPlayer(data, audioPlayer);

    return () => {
      audioPlayer.removeEventListener("loadstart", loadStartHandler);
      audioPlayer.removeEventListener("canplay", playReadyHandler);
      audioPlayer.removeEventListener("ended", songEndedHandler);
      audioPlayer.removeEventListener("waiting", waitingHandler);
      setSongData(null);
    };
  }, [audioPlayer, data, songState]);

  useEffect(() => {
    let videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLVideoElement;

    if (videoPlayer) {
      playerPaused.get ? videoPlayer.pause() : videoPlayer.play();
    }
  }, [playerPaused.get]);

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
  } else if (!songData) {
    return null;
  }

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
          thumbnailURL={songData.thumbnail}
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
          data={songData}
          songState={songState}
          audioPlayer={audioPlayer}
          playerTime={playerTime}
          playerPaused={playerPaused}
          playerLoading={audioLoading}
        />
      </div>

      <div
        className="flex items-center justify-end w-[30%] h-full gap-1"
        onMouseOver={() => setShowVolumeBar(true)}
        onMouseOut={() => setShowVolumeBar(false)}
      >
        <Extras
          data={songData}
          audioPlayer={audioPlayer}
          showVolumeBar={true}
        />
      </div>
    </div>
  );
}
