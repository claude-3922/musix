/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { SongData } from "@/util/types/SongData";
import { pSBC } from "@/util/pSBC";
import { StateManager } from "@/util/types/StateManager";
import SeekBar from "../Util/SeekBar";
import { COLORS } from "@/util/enums/colors";
import {
  HeartEmpty,
  HeartFill,
  LoopAll,
  LoopOff,
  VolumeFull,
  VolumeMute,
} from "../Icons/Icons";
import useAuth from "@/app/hooks/Auth";

interface ExtrasProps {
  data: SongData;
  audioPlayer: HTMLAudioElement;
  showVolumeBar: boolean;
}

export default function Extras({
  data,
  audioPlayer,
  showVolumeBar,
}: ExtrasProps) {
  const [showLikeFill, setShowLikeFill] = useState(false);
  const [looped, setLooped] = useState(false);
  const [muted, setMuted] = useState(false);

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

  const user = useAuth();

  return (
    <>
      {showVolumeBar && (
        <span className="grow max-w-[25%]" onClick={(e) => e.stopPropagation()}>
          <SeekBar
            width="100%"
            height="4px"
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
        </span>
      )}

      <button
        className="h-[30%] w-[12%] hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          const isMuted = audioPlayer.volume === 0;
          isMuted
            ? (audioPlayer.volume = JSON.parse(
                localStorage.getItem("volume") || "1"
              ))
            : (audioPlayer.volume = 0);
        }}
      >
        {muted ? (
          <VolumeMute size={"90%"} fill={"#e8eaed"} />
        ) : (
          <VolumeFull size={"90%"} fill={"#e8eaed"} />
        )}
      </button>

      {user && (
        <button
          className="h-[30%] w-[10%] hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setShowLikeFill((p) => !p);
          }}
        >
          {showLikeFill ? (
            <HeartFill size={"80%"} fill={COLORS.ACCENT} />
          ) : (
            <HeartEmpty size={"80%"} fill={"#e8eaed"} />
          )}
        </button>
      )}
      <button
        className="h-[30%] w-[10%] hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          setLooped(!looped);
          audioPlayer.loop = !looped; //Need a ! because state won't update until rerender
        }}
      >
        {looped ? (
          <LoopAll size={"80%"} fill={COLORS.ACCENT} />
        ) : (
          <LoopOff size={"80%"} fill={"#e8eaed"} />
        )}
      </button>
    </>
  );
}
