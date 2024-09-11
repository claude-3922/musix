/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { SongData } from "@/util/types/SongData";
import { pSBC } from "@/util/pSBC";
import { StateManager } from "@/util/types/StateManager";
import SeekBar from "../Util/SeekBar";
import { COLORS } from "@/util/enums/colors";

interface ExtrasProps {
  data: SongData;
  audioPlayer: HTMLAudioElement;
}

export default function Extras({ data, audioPlayer }: ExtrasProps) {
  const [showLikeFill, setShowLikeFill] = useState(false);
  const [looped, setLooped] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);

  const volumeSlider = useRef<HTMLInputElement | null>(null);

  audioPlayer.onvolumechange = () => {
    const isMuted = audioPlayer.volume === 0;
    setMuted(isMuted);

    if (volumeSlider.current) {
      isMuted
        ? (volumeSlider.current.value = "0")
        : (volumeSlider.current.value = `${audioPlayer.volume}`);
    }

    localStorage.setItem("volume", JSON.stringify(audioPlayer.volume));
  };

  return (
    <div
      className="flex flex-row justify-end items-center w-[30vw] h-[4vw]"
      onMouseOver={() => setShowVolumeBar(true)}
      onMouseOut={() => setShowVolumeBar(false)}
    >
      <span className="mr-[1vw]">
        {showVolumeBar && (
          <SeekBar
            width="7vw"
            height="0.25vw"
            containerStyles={{
              borderRadius: "10vw",
              backgroundColor: COLORS.BG,
            }}
            progressStyles={{
              backgroundColor: COLORS.ACCENT,
              borderRadius: "10vw",
            }}
            progressPercentage={audioPlayer.volume * 100}
            thumbRadius_pixels={16}
            thumbStyles={{
              backgroundColor: COLORS.ACCENT,
              transition: "opacity 0.125s linear, transform 0.125s linear",
            }}
            onSeek={(newPercentage) => {
              const newVolume = newPercentage / 100;
              if (newVolume <= 1 && newVolume >= 0)
                audioPlayer.volume = newVolume;
            }}
            onMouseDragStart={(_, thumb) => {
              thumb.style.transform = "scale(1.3)";
            }}
            onMouseDragEnd={(_, thumb) => {
              thumb.style.transform = "scale(1)";
            }}
          />
        )}
      </span>

      <button
        className="mr-[1.5vw] hover:scale-110"
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
        className="mr-[1.5vw] hover:scale-110"
        onClick={() => setShowLikeFill((p) => !p)}
      >
        {showLikeFill ? heartFill(COLORS.ACCENT) : heartNoFill}
      </button>
      <button
        className="mr-[1.5vw] hover:scale-110"
        onClick={() => {
          setLooped(!looped);
          audioPlayer.loop = !looped; //Need a ! because state won't update until rerender
        }}
      >
        {looped ? loopFill : loopNoFill}
      </button>
    </div>
  );
}

export const heartNoFill = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#e8eaed"
  >
    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
  </svg>
);

export const heartFill = (fillColor: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill={`${fillColor}`}
  >
    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Z" />
  </svg>
);

const loopNoFill = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="22px"
    viewBox="0 -960 960 960"
    width="22px"
    fill="#e8eaed"
  >
    <path d="m274-200 34 34q12 12 11.5 28T308-110q-12 12-28.5 12.5T251-109L148-212q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l103-103q12-12 28.5-11.5T308-370q11 12 11.5 28T308-314l-34 34h406v-120q0-17 11.5-28.5T720-440q17 0 28.5 11.5T760-400v120q0 33-23.5 56.5T680-200H274Zm412-480H280v120q0 17-11.5 28.5T240-520q-17 0-28.5-11.5T200-560v-120q0-33 23.5-56.5T280-760h406l-34-34q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T709-851l103 103q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L709-589q-12 12-28.5 11.5T652-590q-11-12-11.5-28t11.5-28l34-34Z" />
  </svg>
);

const loopFill = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="22px"
    viewBox="0 -960 960 960"
    width="22px"
    fill={`${COLORS.ACCENT}`}
  >
    <path d="M120-40q-33 0-56.5-23.5T40-120v-720q0-33 23.5-56.5T120-920h720q33 0 56.5 23.5T920-840v720q0 33-23.5 56.5T840-40H120Zm154-160h406q33 0 56.5-23.5T760-280v-120q0-17-11.5-28.5T720-440q-17 0-28.5 11.5T680-400v120H274l34-34q12-12 11.5-28T308-370q-12-12-28.5-12.5T251-371L148-268q-6 6-8.5 13t-2.5 15q0 8 2.5 15t8.5 13l103 103q12 12 28.5 11.5T308-110q11-12 11.5-28T308-166l-34-34Zm412-480-34 34q-12 12-11.5 28t11.5 28q12 12 28.5 12.5T709-589l103-103q6-6 8.5-13t2.5-15q0-8-2.5-15t-8.5-13L709-851q-12-12-28.5-11.5T652-850q-11 12-11.5 28t11.5 28l34 34H280q-33 0-56.5 23.5T200-680v120q0 17 11.5 28.5T240-520q17 0 28.5-11.5T280-560v-120h406Z" />
  </svg>
);
