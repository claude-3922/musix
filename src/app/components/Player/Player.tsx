/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import hexRgb from "hex-rgb";

import React, {
  useContext,
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  createRef,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import Thumbnail from "./Thumbnail";
import Controls from "./Controls";
import Extras from "./Extras";
import PlayerLoading from "./PlayerLoading";
import { pSBC } from "@/util/pSBC";
import Title from "./Title";
import { SongData } from "@/util/types/SongData";

import { StateManager } from "@/util/types/StateManager";
import { queueDB } from "@/db/queueDB";
import { useLiveQuery } from "dexie-react-hooks";
import { resolve } from "path";
import useStateManager from "@/app/hooks/StateManager";

interface PlayerProps {
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
  previewState: StateManager<boolean>;
}

export function Player({ audioPlayer, songState, previewState }: PlayerProps) {
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
  };

  useEffect(() => {
    if (!data || !audioPlayer) return;

    const completeColors = async (
      incompleteData: SongData,
      videoId: string
    ): Promise<SongData> => {
      let data = { ...incompleteData };
      if (!data.playerInfo.accentColors || !data.playerInfo.topColor) {
        try {
          const res = await fetch(`/data/colors?id=${data.vid.id || videoId}`);
          const colors = await res.json();
          data.playerInfo.accentColors = colors.accentColors;
          data.playerInfo.topColor = colors.topColor;
        } catch (error) {
          console.error("Error fetching colors:", error);
        }
      }
      return data;
    };

    const loadStartHandler = () => {
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

      await queueDB.queue.where("vid.id").equals(songToPlay.vid.id).delete();
    };

    const initPlayer = async (
      data: SongData,
      audioPlayer: HTMLAudioElement
    ) => {
      const fullData = await completeColors(data, data.vid.id);
      setSongData(fullData);
      queueDB.setNowPlaying(fullData);

      audioPlayer.load();
      audioPlayer.volume = Number(
        JSON.parse(sessionStorage.getItem("volume") || "1")
      );

      audioPlayer.addEventListener("loadstart", loadStartHandler);
      audioPlayer.addEventListener("canplay", playReadyHandler);
      audioPlayer.addEventListener("ended", songEndedHandler);
    };

    initPlayer(data, audioPlayer);

    return () => {
      audioPlayer.removeEventListener("loadstart", loadStartHandler);
      audioPlayer.removeEventListener("canplay", playReadyHandler);
      audioPlayer.removeEventListener("ended", songEndedHandler);
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

  if (songData && audioPlayer) {
    const { vid, owner, playerInfo } = songData;

    audioPlayer.addEventListener("timeupdate", timeUpdateHandler);
    audioPlayer.addEventListener("pause", pauseHandler);
    audioPlayer.addEventListener("play", playHandler);

    const darkerAccent = pSBC(-0.925, playerInfo.topColor, "#1E201E");

    return (
      <div
        className={`text-white flex flex-row items-center justify-between w-[100vw] h-[6vw] px-[1vw] mx-[1vw] rounded-xl`}
        style={{
          backgroundColor: darkerAccent ?? "gray",
        }}
      >
        <div className="flex justify-start items-center w-[30vw]">
          <Thumbnail songData={{ vid, owner, playerInfo }} />
          <Title data={{ vid, owner, playerInfo }} />
        </div>

        <div className="flex flex-col justify-evenly w-[40vw] h-[5vw] items-center">
          <Controls
            data={{ vid, owner, playerInfo }}
            songState={songState}
            audioPlayer={audioPlayer}
            playerTime={playerTime}
            playerPaused={playerPaused}
            playerLoading={audioLoading}
          />
        </div>

        <Extras
          data={{ vid, owner, playerInfo }}
          audioPlayer={audioPlayer}
          previewState={previewState}
        />
      </div>
    );
  } else {
    return <PlayerLoading />;
  }
}
