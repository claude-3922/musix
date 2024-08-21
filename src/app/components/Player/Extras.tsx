/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { SongData } from "./Player";
import { pSBC } from "@/util/pSBC";

interface ExtrasProps {
  player: SongData;
  audioPlayer: HTMLAudioElement;
}

export default function Extras({ player, audioPlayer }: ExtrasProps) {
  const { vid, playerInfo, owner } = player;
  const [showLikeFill, setShowLikeFill] = useState(false);
  const [looped, setLooped] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);

  const volumeSlider = useRef<HTMLInputElement | null>(null);

  const lighterAccent = pSBC(0.25, playerInfo.topColor);

  audioPlayer.onvolumechange = () => {
    const isMuted = audioPlayer.volume === 0;
    setMuted(isMuted);

    if (volumeSlider.current) {
      isMuted
        ? (volumeSlider.current.value = "0")
        : (volumeSlider.current.value = `${audioPlayer.volume}`);
    }
  };

  return (
    <div
      className="flex flex-row justify-end items-center w-[17vw]"
      onMouseOver={() => setShowVolumeBar(true)}
      onMouseOut={() => setShowVolumeBar(false)}
    >
      <input
        type="range"
        className="bg-white w-[7vw] h-[0.5vh] rounded-[10px] mr-[1.125rem]"
        style={{
          accentColor: lighterAccent ?? "gray",
        }}
        ref={volumeSlider}
        min={0}
        max={1}
        step={0.05}
        onChange={(e) => {
          audioPlayer.volume = Number(e.target.value);
        }}
        hidden={showVolumeBar ? false : true}
      />

      <button
        className="mr-[1.125rem]"
        onClick={() => {
          const isMuted = audioPlayer.volume === 0;
          isMuted ? (audioPlayer.volume = 1) : (audioPlayer.volume = 0);
        }}
      >
        <img
          src={muted ? "/icons/volume_mute.svg" : "icons/volume.svg"}
          height={25}
          width={25}
        ></img>
      </button>

      <button
        className="mr-[1.125rem]"
        onClick={() => setShowLikeFill((p) => !p)}
      >
        {showLikeFill ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill={`${lighterAccent}`}
            className="bi bi-heart-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
            />
          </svg>
        ) : (
          <img src="/icons/heart.svg" height={18} width={18}></img>
        )}
      </button>
      <button
        className="mr-[1.125rem]"
        onClick={() => {
          setLooped((p) => !p);
          audioPlayer.loop = !looped; //Need a ! because state won't update until rerender
        }}
      >
        {looped ? (
          <img src="/icons/repeat_tick.svg" height={22} width={22} />
        ) : (
          <img src="/icons/repeat.svg" height={22} width={22} />
        )}
      </button>
    </div>
  );
}
