/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Thumbnail from "./Thumbnail";
import Controls from "./Controls";
import Extras from "./Extras";
import PlayerLoading from "./PlayerLoading";
import { pSBC } from "@/util/pSBC";
import Title from "./Title";
import { SongData } from "@/util/types/SongData";

import { StateManager } from "@/util/types/StateManager";
import { queueDB } from "@/db/queueDB";

import useStateManager from "@/app/hooks/StateManager";
import PlayerEmpty from "./PlayerEmpty";
import { PAGE_STATES } from "@/util/enums/pageState";

interface PlayerProps {
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
  pageState: StateManager<PAGE_STATES>;
}

export function Player({ audioPlayer, songState, pageState }: PlayerProps) {
  const data = songState.get;

  const [songData, setSongData] = useState<SongData | null>(null);
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
      if (audioPlayer.loop) return;

      const queue = queueDB.queue.toCollection();
      const songToPlay = await queue.first();

      if (!songToPlay) return;
      await queueDB.history.add(songToPlay);

      songState.set(songToPlay);

      await queueDB.queue.where("vid.id").equals(songToPlay.id).delete();
    };

    const initPlayer = async (
      data: SongData,
      audioPlayer: HTMLAudioElement
    ) => {
      setSongData(data);
      queueDB.setNowPlaying(data);

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
    return <PlayerEmpty />;
  } else if (!songData) {
    return <PlayerLoading />;
  }

  audioPlayer.addEventListener("timeupdate", timeUpdateHandler);
  audioPlayer.addEventListener("pause", pauseHandler);
  audioPlayer.addEventListener("play", playHandler);

  return (
    <div
      className={`no-select text-white flex flex-row items-center justify-between w-[100vw] h-[6.07vw] px-[1vw]`}
      style={{
        background: `linear-gradient(90deg, ${pSBC(0.01, "#000000")} 0%, ${pSBC(
          0.02,
          "#000000"
        )} 25%, ${pSBC(0.03, "#000000")} 50%, ${pSBC(
          0.02,
          "#000000"
        )} 75%, ${pSBC(0.01, "#000000")} 100%)`,
      }}
    >
      <div className="flex justify-start items-center w-[30vw]">
        <Thumbnail songData={songData} pageState={pageState} />
        <Title data={songData} />
      </div>

      <div className="flex flex-col justify-center w-[40vw] h-[6.07vw] items-center">
        <Controls
          data={songData}
          songState={songState}
          audioPlayer={audioPlayer}
          playerTime={playerTime}
          playerPaused={playerPaused}
          playerLoading={audioLoading}
        />
      </div>

      <Extras data={songData} audioPlayer={audioPlayer} />
    </div>
  );
}
