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
import Info from "./Info";
import Extras from "./Extras";
import PlayerLoading from "./PlayerLoading";
import { pSBC } from "@/util/pSBC";

interface PlayerProps {
  songId: string;
  vidEnabled: boolean;
  audioPlayer: HTMLAudioElement | null;
}

export interface SongData {
  vid: {
    id: string;
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
  };
  owner: {
    title: string;
    url: string;
    thumbnail: string;
  };
  playerInfo: {
    accentColors: string[];
    topColor: string;
  };
}

export async function Player({ songId, audioPlayer, vidEnabled }: PlayerProps) {
  const [songData, setSongData] = useState<SongData | null>(null);

  useEffect(() => {
    async function fetchDataAndPlay() {
      setSongData(null);
      if (songId.length > 0) {
        const res = await fetch(`/data?id=${songId}`, {
          method: "POST",
        });

        if (res.status === 200) {
          const data = await res.json();
          setSongData(data);
        }

        await audioPlayer?.play();
        if (document.getElementById("videoPlayer")) {
          await (
            document.getElementById("videoPlayer") as HTMLVideoElement
          ).play();
        }
      }
    }
    fetchDataAndPlay();
  }, [songId, audioPlayer, vidEnabled]);

  if (audioPlayer) {
    if (songData) {
      const { vid, owner, playerInfo } = songData;

      const darkerAccent = pSBC(-0.8, playerInfo.topColor, "#1E201E");

      return (
        <div
          className={`text-white flex flex-row items-center justify-between w-[100vw] h-[14vh] px-[1vw] my-[2vh] mx-[1vw] rounded-[4px]`}
          style={{
            backgroundColor: darkerAccent ?? "gray",
          }}
        >
          <Thumbnail songData={{ vid, owner, playerInfo }} />

          <Info player={{ vid, owner, playerInfo }} audioPlayer={audioPlayer} />
          <Extras
            player={{ vid, owner, playerInfo }}
            audioPlayer={audioPlayer}
          />
        </div>
      );
    } else {
      return (
        <div
          className={`text-white flex flex-row items-center justify-center w-[100vw] h-[14vh] px-[1vw] my-[2vh] mx-[1vw] rounded-[4px] bg-custom_gray/20`}
        >
          <h1 className="text-2xl">Just a sec...</h1>
        </div>
      );
    }
  } else {
    console.log("Audio element doesn't exist. This really shouldn't happen");
  }
}
