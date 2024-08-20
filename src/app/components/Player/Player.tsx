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

export async function Player({ songId, vidEnabled, audioPlayer }: PlayerProps) {
  const [songData, setSongData] = useState<SongData | null>(null);

  useEffect(() => {
    async function fetchDataAndPlay() {
      const res = await fetch(`/data?id=${songId}`, {
        method: "POST",
      });

      if (res.status === 200) {
        const data = await res.json();
        setSongData(data);
      }

      await audioPlayer?.play();
    }
    fetchDataAndPlay();
  }, [songId, vidEnabled, audioPlayer]);

  if (audioPlayer) {
    if (songData) {
      const { vid, owner, playerInfo } = songData;

      const darkerAccent = pSBC(-0.75, playerInfo.topColor);

      return (
        <div
          className={`text-white flex flex-row items-center justify-between w-[100vw] h-[14vh] px-[2vw] my-[2vh] mx-[1vw] rounded-[4px]`}
          style={{
            backgroundColor: darkerAccent ?? "gray",
          }}
        >
          <Thumbnail
            songData={{ vid, owner, playerInfo }}
            audioPlayer={audioPlayer}
            vidEnabled={vidEnabled}
          />

          <Info player={{ vid, owner, playerInfo }} audioPlayer={audioPlayer} />
          <Extras
            player={{ vid, owner, playerInfo }}
            audioPlayer={audioPlayer}
          />
        </div>
      );
    }
  } else {
    console.log("Audio element doesn't exist. This really shouldn't happen");
  }
}
