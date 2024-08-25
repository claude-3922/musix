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
import { Queue } from "@/util/types/Queue";

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

    let completeData = data;

    async function loadFromData(data: SongData, audioPlayer: HTMLAudioElement) {
      if (
        !completeData.playerInfo.accentColors ||
        !completeData.playerInfo.topColor
      ) {
        const res = await fetch(`/data/colors?id=${completeData.vid.id}`);
        const colors = await res.json();
        completeData.playerInfo.accentColors = colors.accentColors;
        completeData.playerInfo.topColor = colors.topColor;
      }

      setSongData(completeData);

      audioPlayer.load();

      sessionStorage.setItem("now_playing", JSON.stringify(completeData));
    }

    setSongData(null);

    audioPlayer.volume = Number(
      JSON.parse(sessionStorage.getItem("volume") || "1")
    );

    loadFromData(data, audioPlayer);

    audioPlayer.onloadstart = () => {
      setAudioLoading(true);
    };

    audioPlayer.oncanplay = () => {
      setAudioLoading(false);

      audioPlayer.play();
    };

    return () => {
      if (!data) return;

      let history: Queue;

      if (!sessionStorage.getItem("history")) {
        sessionStorage.setItem(
          "history",
          JSON.stringify({ items: [] } as Queue)
        );
      }
      history = JSON.parse(
        sessionStorage.getItem("history") as string
      ) as Queue;
      history.items.push(completeData as SongData);

      sessionStorage.setItem("history", JSON.stringify(history));
    };
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
