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
import { COLORS } from "@/util/enums/colors";
import { enqueue, play } from "@/player/manager";

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
  const previousHandler = async () => {
    const historyArray = await queueDB.history.toArray();
    const nowPlaying = await queueDB.getNowPlaying();
    const prevSong = historyArray[historyArray.length - 1];

    if (!prevSong || historyArray.length === 0) {
      return (audioPlayer.currentTime = 0);
    }

    if (nowPlaying) {
      const enqueued = await enqueue(nowPlaying);
      if (!enqueued) {
        console.log("Failed to enqueue song");
      }
    }

    const played = await play(songState, prevSong, false);
    if (!played) {
      console.log("Failed to play song");
    }

    await queueDB.history.where("vid.id").equals(prevSong.id).delete();
  };

  const nextHandler = async () => {
    const queue = await queueDB.queue.toArray();
    if (queue.length === 0) return;
    const songToPlay = queue[0];

    if (!songToPlay) return;
    const played = await play(songState, songToPlay);
    if (!played) {
      console.log("Failed to play song");
    }

    await queueDB.queue.where("vid.id").equals(songToPlay.id).delete();
  };

  return (
    <>
      <span className="flex flex-row justify-between items-center">
        <button
          className="mr-[0.75rem] hover:scale-110 transition:transform"
          onClick={previousHandler}
        >
          {previousButton}
        </button>

        <button
          className="mr-[0.75rem]"
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
        >
          {playerLoading
            ? loadingSpinner("3vw", "3vw")
            : !playerPaused.get
            ? pauseButton
            : playButton}
        </button>
        <button
          className="hover:scale-110 transition:transform"
          onClick={nextHandler}
        >
          {nextButton}
        </button>
      </span>
      <span className="flex flex-row items-center justify-center">
        <span className="flex flex-row">
          <span className="flex text-sm w2vw] overflow-hidden justify-center">
            {formatSongDuration(playerTime.get)}
          </span>

          <SeekBar
            containerStyles={{
              backgroundColor: COLORS.BG,
              borderRadius: "10vw",
            }}
            progressStyles={{
              backgroundColor: COLORS.ACCENT,
              borderRadius: "10vw",
            }}
            height="0.25vw"
            width="30vw"
            progressPercentage={(playerTime.get / data.duration) * 100}
            thumbRadius_pixels={16}
            thumbStyles={{
              backgroundColor: COLORS.ACCENT,
              transition: "opacity 0.125s linear, transform 0.125s linear",
            }}
            onSeek={(newPercentage) => {
              const newTime = (newPercentage * data.duration) / 100;
              audioPlayer.currentTime = newTime;
              let videoPlayer = document.getElementById(
                "videoPlayer"
              ) as HTMLVideoElement;

              if (videoPlayer) {
                videoPlayer.currentTime = newTime;
              }
            }}
            onMouseDragStart={(_, thumb) => {
              thumb.style.transform = "scale(1.3)";
            }}
            onMouseDragEnd={(_, thumb) => {
              thumb.style.transform = "scale(1)";
            }}
            songDuration={data.duration}
          />

          <span
            id="audioTime"
            className="flex text-sm w2vw] overflow-hidden justify-center"
          >
            {formatSongDuration(data.duration)}
          </span>
        </span>
      </span>
    </>
  );
}

export const loadingSpinner = (height: string, width: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 -960 960 960"
    width={width}
    fill="#e8eaed"
    style={{
      transformOrigin: "center",
      animation: "spin 1s linear infinite",
    }}
  >
    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
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
    className="hover:scale-110 transition:transform"
    xmlns="http://www.w3.org/2000/svg"
    height="3vw"
    viewBox="0 -960 960 960"
    width="3vw"
    fill="#e8eaed"
  >
    <path d="m426-330 195-125q14-9 14-25t-14-25L426-630q-15-10-30.5-1.5T380-605v250q0 18 15.5 26.5T426-330Zm54 250q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
  </svg>
);

const pauseButton = (
  <svg
    className="hover:scale-110 transition:transform"
    xmlns="http://www.w3.org/2000/svg"
    height="3vw"
    viewBox="0 -960 960 960"
    width="3vw"
    fill="#e8eaed"
  >
    <path d="M400-320q17 0 28.5-11.5T440-360v-240q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v240q0 17 11.5 28.5T400-320Zm160 0q17 0 28.5-11.5T600-360v-240q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v240q0 17 11.5 28.5T560-320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
  </svg>
);

const nextButton = (
  <svg
    className="hover:scale-110 transition:transform"
    xmlns="http://www.w3.org/2000/svg"
    height="2vw"
    viewBox="0 -960 960 960"
    width="2vw"
    fill="#e8eaed"
  >
    <path d="M660-280v-400q0-17 11.5-28.5T700-720q17 0 28.5 11.5T740-680v400q0 17-11.5 28.5T700-240q-17 0-28.5-11.5T660-280Zm-440-35v-330q0-18 12-29t28-11q5 0 11 1t11 5l248 166q9 6 13.5 14.5T548-480q0 10-4.5 18.5T530-447L282-281q-5 4-11 5t-11 1q-16 0-28-11t-12-29Z" />
  </svg>
);

const previousButton = (
  <svg
    className="hover:scale-110 transition:transform"
    xmlns="http://www.w3.org/2000/svg"
    height="2vw"
    viewBox="0 -960 960 960"
    width="2vw"
    fill="#e8eaed"
  >
    <path d="M220-280v-400q0-17 11.5-28.5T260-720q17 0 28.5 11.5T300-680v400q0 17-11.5 28.5T260-240q-17 0-28.5-11.5T220-280Zm458-1L430-447q-9-6-13.5-14.5T412-480q0-10 4.5-18.5T430-513l248-166q5-4 11-5t11-1q16 0 28 11t12 29v330q0 18-12 29t-28 11q-5 0-11-1t-11-5Z" />
  </svg>
);
