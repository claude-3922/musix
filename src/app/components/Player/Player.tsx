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
    thumbnail: {
      main: string;
      alt: string;
    };
    duration: number;
  };
  owner: {
    title: string;
    url: string;
    thumbnail: {
      main: string;
      alt: string;
    };
  };
  playerInfo: {
    volume: number;
    loop: boolean;
    vidEnabled: boolean;
    accentColors: string[];
    topColor: string;
  };
}

export async function Player({ songId, vidEnabled, audioPlayer }: PlayerProps) {
  const [songData, setSongData] = useState<SongData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/data?id=${songId}`, {
        method: "POST",
        body: JSON.stringify({
          def_vid_thumbnail: `/def_vid_thumbnail.png`,
          def_ch_thumbnail: `/def_ch_thumbnail.png`,
          volume: 0.5,
          loop: false,
          vidEnabled: vidEnabled,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setSongData(data);
      }
    }
    fetchData();
  }, [songId, vidEnabled]);

  if (audioPlayer) {
    if (songData) {
      const { vid, owner, playerInfo } = songData;

      const red = hexRgb(playerInfo.topColor).red;
      const green = hexRgb(playerInfo.topColor).green;
      const blue = hexRgb(playerInfo.topColor).blue;
      const alpha = hexRgb(playerInfo.topColor).alpha;

      return (
        <div
          className={`text-white flex flex-row items-center justify-evenly w-[100vw] h-[18vh] px-[2vw] my-[2vh] mx-[1vw] rounded-[4px]`}
          style={{
            backgroundColor: `rgba(${red}, ${green}, ${blue}, ${
              alpha > 0.5 ? alpha - 0.5 : alpha
            })`,
          }}
        >
          <Thumbnail
            songData={{ vid, owner, playerInfo }}
            audioPlayer={audioPlayer}
          />

          <Info player={{ vid, owner, playerInfo }} audioPlayer={audioPlayer} />
          <Extras />
        </div>
      );
    }
  } else {
    //error component
    //console.log("Component player can't load cuz audioPLayer is null");
  }
}
