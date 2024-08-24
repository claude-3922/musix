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
} from "react";
import Thumbnail from "./Thumbnail";
import Controls from "./Controls";
import Extras from "./Extras";
import PlayerLoading from "./PlayerLoading";
import { pSBC } from "@/util/pSBC";
import Title from "./Title";
import { SongData } from "@/util/types/SongData";
import { getAccentColors } from "@/util/colors";

interface PlayerProps {
  data: SongData | null;
  toggleSongData: (s: SongData) => void;
  audioPlayer: HTMLAudioElement | null;
  togglePreview: (b: boolean) => void;
  getPreview: () => boolean;
}

export function Player({
  togglePreview,
  getPreview,
  data,
  toggleSongData,
  audioPlayer,
}: PlayerProps) {
  const [songData, setSongData] = useState<SongData | null>(null);

  const [audioLoading, setAudioLoading] = useState(true);

  useEffect(() => {
    async function playFromData(data: SongData, audioPlayer: HTMLAudioElement) {
      let completeData = data;
      const res = await fetch(`/data/colors?id=${completeData.vid.id}`);
      const colors = await res.json();
      completeData.playerInfo.accentColors = colors.colors;
      completeData.playerInfo.topColor = colors.topColor;

      setSongData(completeData);

      audioPlayer.load();
      sessionStorage.setItem("now_playing", JSON.stringify(data));
    }

    setSongData(null);

    if (data && audioPlayer) {
      audioPlayer.volume = Number(
        JSON.parse(sessionStorage.getItem("volume") || "1")
      );

      playFromData(data, audioPlayer);
    }

    //TODO: fix bug which causes the first song in the history to be repeated
    return () => {
      if (data) {
        if (!sessionStorage.getItem("history")) {
          sessionStorage.setItem("history", "[]");
        }

        let history = JSON.parse(
          sessionStorage.getItem("history") as any
        ) as SongData[];

        history.push(data);
        sessionStorage.setItem("history", JSON.stringify(history));
      }
    };
  }, [audioPlayer, data]);

  if (songData && audioPlayer) {
    const { vid, owner, playerInfo } = songData;

    audioPlayer.onloadstart = () => {
      setAudioLoading(true);
    };

    audioPlayer.oncanplay = () => {
      setAudioLoading(false);

      audioPlayer.play();
    };

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
            toggleSongData={toggleSongData}
            audioPlayer={audioPlayer}
            isAudioLoading={audioLoading}
          />
        </div>

        <Extras
          data={{ vid, owner, playerInfo }}
          audioPlayer={audioPlayer}
          togglePreview={togglePreview}
          getPreview={getPreview}
        />
      </div>
    );
  } else {
    return <PlayerLoading />;
  }
}
