/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { SongData } from "@/util/types/SongData";
import { pSBC } from "@/util/pSBC";

interface ExtrasProps {
  data: SongData;
  audioPlayer: HTMLAudioElement;
  togglePreview: (b: boolean) => void;
  getPreview: () => boolean;
}

export default function Extras({
  data,
  audioPlayer,
  togglePreview,
  getPreview,
}: ExtrasProps) {
  const { vid, playerInfo, owner } = data;
  const [showLikeFill, setShowLikeFill] = useState(false);
  const [looped, setLooped] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showVolumeBar, setShowVolumeBar] = useState(false);

  const volumeSlider = useRef<HTMLInputElement | null>(null);

  const lighterAccent = pSBC(0.4, playerInfo.topColor);

  audioPlayer.onvolumechange = () => {
    const isMuted = audioPlayer.volume === 0;
    setMuted(isMuted);

    if (volumeSlider.current) {
      isMuted
        ? (volumeSlider.current.value = "0")
        : (volumeSlider.current.value = `${audioPlayer.volume}`);
    }

    sessionStorage.setItem("volume", JSON.stringify(audioPlayer.volume));
  };

  audioPlayer.onplay = () => {
    if (volumeSlider.current) {
      volumeSlider.current.value = `${audioPlayer.volume}`;
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
        className="bg-white w-[7vw] h-[0.5vh] rounded-[10px] mr-[1.125rem] opacity-85 "
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
        className="mr-[1.125rem] opacity-85 hover:opacity-100"
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
        className="mr-[1.125rem] opacity-85 hover:opacity-100"
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
        className="mr-[1.125rem] opacity-85 hover:opacity-100"
        onClick={() => {
          setLooped((p) => !p);
          audioPlayer.loop = !looped; //Need a ! because state won't update until rerender
        }}
      >
        {looped ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill={`${lighterAccent}`}
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
      <span
        className={`flex justify-center items-center w-[2rem] h-[2rem] overflow-hidden`}
      >
        <button
          className=" opacity-85 hover:opacity-100"
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
