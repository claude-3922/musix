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

    const loadFromData = async (
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
      audioPlayer.onloadstart = () => {
        setAudioLoading(true);
      };
      audioPlayer.oncanplay = () => {
        setAudioLoading(false);
        audioPlayer.play();
      };
    };

    loadFromData(data, audioPlayer);
  }, [audioPlayer, data]);

  if (songData && audioPlayer) {
    const { vid, owner, playerInfo } = songData;

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
            isAudioLoading={audioLoading}
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
