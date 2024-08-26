/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ChangeEvent, CSSProperties, useRef, useState } from "react";
import { SongData } from "@/util/types/SongData";
import { formatSongDuration } from "@/util/format";

import { pSBC } from "@/util/pSBC";

import { StateManager } from "@/util/types/StateManager";
import { queueDB } from "@/db/queueDB";

interface ControlsProps {
  data: SongData;
  audioPlayer: HTMLAudioElement;
  isAudioLoading: boolean;
  songState: StateManager<SongData | null>;
}

export default function Controls({
  data,
  audioPlayer,
  isAudioLoading,
  songState,
}: ControlsProps) {
  const { vid, playerInfo } = data;

  const [playing, setPlaying] = useState(true);
  const [audioTime, setAudioTime] = useState(0);

  const seekBar = useRef<HTMLInputElement | null>(null);

  const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
    audioPlayer.currentTime = Number(e.target.value);

    let videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLVideoElement;

    if (videoPlayer) {
      videoPlayer.currentTime = Number(e.target.value);
    }
  };

  audioPlayer.onplay = () => {
    setPlaying(true);

    let videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLVideoElement;

    if (videoPlayer) {
      videoPlayer.play();
    }
  };

  audioPlayer.onpause = () => {
    setPlaying(false);

    let videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLVideoElement;

    if (videoPlayer) {
      videoPlayer.pause();
    }
  };

  audioPlayer.ontimeupdate = () => {
    setAudioTime(audioPlayer.currentTime);

    if (seekBar.current) {
      seekBar.current.value = audioPlayer.currentTime.toString();
    }
  };

  const lighterAccent = pSBC(0.4, playerInfo.topColor);

  const seekBarStyle = {
    accentColor: lighterAccent,
    backgroundColor: "white",
  } as CSSProperties;

  return (
    <>
      <span className="flex flex-row justify-center items-center h-[2vw]">
        <button
          className="mr-[0.75rem] opacity-85 hover:opacity-100"
          onClick={async () => {
            const nowPlaying = await queueDB.getNowPlaying();
            if (nowPlaying) await queueDB.queue.add(nowPlaying);

            const historySongCount = await queueDB.history.count();
            const prevSong =
              (await queueDB.history.get(historySongCount)) || null;

            if (!prevSong) {
              return (audioPlayer.currentTime = 0);
            }
            songState.set(prevSong);

            await queueDB.history.delete(historySongCount);
          }}
        >
          <img src="/icons/previous.svg" height={28} width={28}></img>
        </button>

        <button
          className="mr-[0.75rem]"
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
        >
          {isAudioLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2.5vw"
              height="2.5vw"
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
          ) : playing ? (
            <svg
              id="playBackButton"
              xmlns="http://www.w3.org/2000/svg"
              width="2.5vw"
              height="2.5vw"
              fill="white"
              className="playBackButton"
              viewBox="0 0 16 16"
            >
              <path
                className="pause"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"
              />
            </svg>
          ) : (
            <svg
              id="playBackButton"
              xmlns="http://www.w3.org/2000/svg"
              width="2.5vw"
              height="2.5vw"
              fill="white"
              className="playBackButton"
              viewBox="0 0 16 16"
            >
              <path
                className="play"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"
              />
            </svg>
          )}
        </button>
        <button className="mr-[0.75rem] opacity-85 hover:opacity-100">
          <img src="/icons/next.svg" height={28} width={28}></img>
        </button>
      </span>
      <span className="flex flex-row items-center justify-center">
        <span className="flex text-sm w-[5vw] overflow-hidden justify-center">
          {formatSongDuration(audioTime)}
        </span>

        <input
          id="seekBar"
          className="w-[30vw] h-[0.25vw] rounded-[10px]"
          ref={seekBar}
          type="range"
          min={0}
          max={vid.duration}
          step={1}
          onChange={handleSeekChange}
          style={seekBarStyle}
        />

        <span className="flex text-sm w-[5vw] overflow-hidden justify-center">
          {formatSongDuration(vid.duration)}
        </span>
      </span>
    </>
  );
}
