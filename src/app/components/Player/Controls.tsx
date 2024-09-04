/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ChangeEvent, CSSProperties, useEffect, useRef } from "react";
import { SongData } from "@/util/types/SongData";
import { formatSongDuration } from "@/util/format";

import { pSBC } from "@/util/pSBC";

import { StateManager } from "@/util/types/StateManager";
import { queueDB } from "@/db/queueDB";
import SeekBar from "../Util/SeekBar";

interface ControlsProps {
  data: SongData;
  audioPlayer: HTMLAudioElement;
  songState: StateManager<SongData | null>;
  playerTime: StateManager<number>;
  playerPaused: StateManager<boolean>;
  playerLoading: boolean;
}

export default function Controls({
  data,
  audioPlayer,
  playerLoading,
  songState,
  playerTime,
  playerPaused,
}: ControlsProps) {
  const { vid, playerInfo } = data;

  const previousHandler = async () => {
    const historyArray = await queueDB.history.toArray();
    const nowPlaying = historyArray[historyArray.length - 1];
    const prevSong = historyArray[historyArray.length - 2];

    if (!prevSong) {
      return (audioPlayer.currentTime = 0);
    }

    await queueDB.queue.add(nowPlaying);

    await queueDB.history.where("vid.id").equals(nowPlaying.vid.id).delete();

    songState.set(prevSong);
  };

  const nextHandler = async () => {
    const songToPlay = (await queueDB.queue.toArray())[0] || null;

    if (!songToPlay) {
      return songState.set(songToPlay);
    }
    await queueDB.history.add(songToPlay);

    songState.set(songToPlay);

    await queueDB.queue.where("vid.id").equals(songToPlay.vid.id).delete();
  };

  const lighterAccent = playerInfo.topColor;

  return (
    <>
      <span className="flex flex-row justify-between items-center">
        <button
          className="mr-[0.75rem] hover:scale-110 transition:transform"
          onClick={previousHandler}
        >
          <img className="h-[2vw] w-[2vw]" src="/icons/previous.svg"></img>
        </button>

        <button
          className="mr-[0.75rem]"
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
        >
          {playerLoading
            ? loadingSpinner("2.5vw", "2.5vw")
            : !playerPaused.get
            ? pauseButton
            : playButton}
        </button>
        <button
          className="hover:scale-110 transition:transform"
          onClick={nextHandler}
        >
          <img className="mr-[1vw] h-[2vw] w-[2vw]" src="/icons/next.svg"></img>
        </button>
      </span>
      <span className="flex flex-row items-center justify-center">
        <span className="flex flex-row">
          <span className="flex text-sm w-[5vw] overflow-hidden justify-center">
            {formatSongDuration(playerTime.get)}
          </span>

          <SeekBar
            containerStyles={{
              backgroundColor: `rgba(255, 255, 255, 0.1)`,
              borderRadius: "10vw",
            }}
            progressStyles={{
              backgroundColor:
                `${pSBC(0.5, lighterAccent, "#000000")}` || "white",
              borderRadius: "10vw",
            }}
            height="0.25vw"
            width="30vw"
            progressPercentage={(playerTime.get / vid.duration) * 100}
            thumbRadius_pixels={16}
            thumbStyles={{
              backgroundColor: `${pSBC(0.5, lighterAccent, "#2D312C")}`,
            }}
            onSeek={(newPercentage) => {
              const newTime = (newPercentage * vid.duration) / 100;
              audioPlayer.currentTime = newTime;
              let videoPlayer = document.getElementById(
                "videoPlayer"
              ) as HTMLVideoElement;

              if (videoPlayer) {
                videoPlayer.currentTime = newTime;
              }
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
            songDuration={vid.duration}
          />

          <span className="flex text-sm w-[5vw] overflow-hidden justify-center">
            {formatSongDuration(vid.duration)}
          </span>
        </span>
      </span>
    </>
  );
}

export const loadingSpinner = (height: string, width: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 50 50"
    style={{
      transformOrigin: "center",
      animation: "spin 1s linear infinite",
    }}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke="white"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="90, 150"
      strokeDashoffset="0"
    />
    <style>{`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}</style>
  </svg>
);

const playButton = (
  <svg
    id="playBackButton"
    xmlns="http://www.w3.org/2000/svg"
    width="2.5vw"
    height="2.5vw"
    fill="white"
    className="playBackButton hover:scale-110 transition:transform"
    viewBox="0 0 16 16"
  >
    <path
      className="play"
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"
    />
  </svg>
);

const pauseButton = (
  <svg
    id="playBackButton"
    xmlns="http://www.w3.org/2000/svg"
    width="2.5vw"
    height="2.5vw"
    fill="white"
    className="playBackButton hover:scale-110 transition:transform"
    viewBox="0 0 16 16"
  >
    <path
      className="pause"
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"
    />
  </svg>
);
