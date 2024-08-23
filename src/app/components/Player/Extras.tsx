/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { SongData } from "@/util/types/SongData";
import { pSBC } from "@/util/pSBC";

interface ExtrasProps {
  player: SongData;
  audioPlayer: HTMLAudioElement;
  togglePreview: (b: boolean) => void;
  getPreview: () => boolean;
}

export default function Extras({
  player,
  audioPlayer,
  togglePreview,
  getPreview,
}: ExtrasProps) {
  const { vid, playerInfo, owner } = player;
  const [showLikeFill, setShowLikeFill] = useState(false);
  const [looped, setLooped] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);

  const volumeSlider = useRef<HTMLInputElement | null>(null);

  const lighterAccent = pSBC(0.1, playerInfo.topColor);

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
      className="flex flex-row justify-end items-center w-[26vw] h-[4vw]"
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
      <span
        className={`flex justify-center items-center w-[2rem] h-[2rem] overflow-hidden`}
      >
        <button
          onClick={() => {
            togglePreview(!getPreview());
          }}
        >
          {getPreview() ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill={lighterAccent ?? "gray"}
              className="playNoFill"
              viewBox="0 0 16 16"
            >
              <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2m6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="white"
              className="playNoFill"
              viewBox="0 0 16 16"
            >
              <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
            </svg>
          )}
        </button>
      </span>
    </div>
  );
}
