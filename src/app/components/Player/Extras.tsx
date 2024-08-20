/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { SongData } from "./Player";
import { pSBC } from "@/util/pSBC";

interface ExtrasProps {
  player: SongData;
  audioPlayer: HTMLAudioElement;
}

export default function Extras({ player, audioPlayer }: ExtrasProps) {
  const { vid, playerInfo, owner } = player;

  const lighterAccent = pSBC(0.25, playerInfo.topColor);

  return (
    <div className="flex flex-row justify-center items-center">
      <button className="mr-[1.125rem]">
        <img src="/icons/heart.svg" height={18} width={18}></img>
      </button>
      <button className="mr-[1.125rem]">
        <img src="/icons/repeat.svg" height={22} width={22}></img>
      </button>
      <button className="mr-[0.125rem]">
        <img src="/icons/volume.svg" height={25} width={25}></img>
      </button>
      <input
        type="range"
        className="bg-white w-[7vw] h-[0.5vh] rounded-[10px]"
        style={{
          accentColor: lighterAccent ?? "gray",
        }}
        min={0}
        max={1}
        step={0.05}
        onChange={(e) => (audioPlayer.volume = Number(e.target.value))}
      />
    </div>
  );
}
