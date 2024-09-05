/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { SongData } from "@/util/types/SongData";
import { pSBC } from "@/util/pSBC";
import { StateManager } from "@/util/types/StateManager";
import SeekBar from "../Util/SeekBar";

interface ExtrasProps {
  data: SongData;
  audioPlayer: HTMLAudioElement;
  previewState: StateManager<boolean>;
}

export default function Extras({
  data,
  audioPlayer,
  previewState,
}: ExtrasProps) {
  const { playerInfo } = data;
  const [showLikeFill, setShowLikeFill] = useState(false);
  const [looped, setLooped] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);

  const volumeSlider = useRef<HTMLInputElement | null>(null);

  const lighterAccent = playerInfo.topColor;

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
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            progressStyles={{
              backgroundColor:
                `${pSBC(0.5, lighterAccent, "#000000")}` || "white",
              borderRadius: "10vw",
            }}
            progressPercentage={audioPlayer.volume * 100}
            thumbRadius_pixels={16}
            thumbStyles={{
              backgroundColor: `${pSBC(0.5, lighterAccent, "#000000")}`,
            }}
            onSeek={(newPercentage) => {
              const newVolume = newPercentage / 100;
              if (newVolume <= 1 && newVolume >= 0)
                audioPlayer.volume = newVolume;
            }}
            onMouseDragStart={(_, thumb) => {
              thumb.style.outline = `2px solid ${pSBC(
                0.5,
                lighterAccent,
                "#2D312C"
              )}`;
              thumb.style.outlineOffset = `2px`;
            }}
            onMouseDragEnd={(_, thumb) => {
              thumb.style.outline = `none`;
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
        {showLikeFill ? heartFill(lighterAccent || "gray") : heartNoFill}
      </button>
      <button
        className="mr-[1.5vw] hover:scale-110"
        onClick={() => {
          setLooped(!looped);
          audioPlayer.loop = !looped; //Need a ! because state won't update until rerender
        }}
      >
        {looped ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill={`${pSBC(0.5, lighterAccent, "#000000")}`}
            className="bi bi-repeat"
            viewBox="0 0 16 16"
          >
            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="white"
            className="bi bi-repeat"
            viewBox="0 0 16 16"
          >
            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export const heartNoFill = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="white"
    className="bi bi-heart"
    viewBox="0 0 16 16"
  >
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
  </svg>
);

export const heartFill = (fillColor: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill={`${pSBC(0.5, fillColor, "#000000")}`}
    className="bi bi-heart-fill"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
    />
  </svg>
);
