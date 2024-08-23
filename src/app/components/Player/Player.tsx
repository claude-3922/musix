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

interface PlayerProps {
  data: SongData | null;
  audioPlayer: HTMLAudioElement | null;
  togglePreview: (b: boolean) => void;
  getPreview: () => boolean;
}

export function Player({
  togglePreview,
  getPreview,
  data,
  audioPlayer,
}: PlayerProps) {
  const [songData, setSongData] = useState<SongData | null>(null);

  useEffect(() => {
    async function playFromData(data: SongData, audioPlayer: HTMLAudioElement) {
      setSongData(data);
      await audioPlayer.play();
    }

    if (data && audioPlayer) {
      playFromData(data, audioPlayer);
    }
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
            player={{ vid, owner, playerInfo }}
            audioPlayer={audioPlayer}
          />
        </div>

        <Extras
          player={{ vid, owner, playerInfo }}
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
