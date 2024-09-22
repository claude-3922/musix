/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { SongData } from "@/util/types/SongData";
import { formatSongDuration } from "@/util/format";

import { StateManager } from "@/util/types/StateManager";
import SeekBar from "../Util/SeekBar";
import { COLORS } from "@/util/enums/colors";

import {
  LoadingSpinner,
  NextButton,
  PauseButton,
  PlayButton,
  PreviousButton,
} from "../Icons/Icons";
import queue from "@/db/Queue";
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
    const nowPlaying = queue.getNowPlaying;
    const prevSong = queue.getHistory[queue.getHistory.length - 1];
    if (!prevSong || queue.getHistory.length === 0) {
      return (audioPlayer.currentTime = 0);
    }
    if (nowPlaying) {
      const enqueued = enqueue(nowPlaying);
      if (!enqueued) {
        console.log("Failed to enqueue song");
      }
    }
    const played = play(songState, prevSong, false);
    if (!played) {
      console.log("Failed to play song");
    }
    queue.unlog(prevSong);
  };

  const nextHandler = async () => {
    const currentQueue = queue.getQueue;
    if (currentQueue.length === 0) {
      const suggestionsRes = await fetch(`api/data/suggestions?id=${data.id}`);
      const suggestions: SongData[] = await suggestionsRes.json();
      if (suggestions.length > 0) {
        const songToPlay =
          suggestions[Math.floor(Math.random() * suggestions.length - 1)];
        const played = play(songState, songToPlay);
        if (!played) {
          console.log("Failed to play song");
        }
      }
      return;
    }
    const songToPlay = currentQueue[0];
    if (!songToPlay) return;
    const played = play(songState, songToPlay);
    if (!played) {
      console.log("Failed to play song");
    }
    queue.dequeue(songToPlay);
  };

  return (
    <>
      <span className="flex flex-row justify-center items-center w-[50%] h-[40%]">
        <button
          className="w-[17%] h-full hover:scale-110 transition:transform"
          onClick={previousHandler}
        >
          <PreviousButton size={"100%"} fill={"#e8eaed"} />
        </button>

        <button
          className="w-[20%] h-[120%] hover:scale-110 transition:transform"
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
        >
          {playerLoading ? (
            <LoadingSpinner size={"100%"} fill={"#e8eaed"} />
          ) : !playerPaused.get ? (
            <PauseButton size={"100%"} fill={"#e8eaed"} />
          ) : (
            <PlayButton size={"100%"} fill={"#e8eaed"} />
          )}
        </button>
        <button
          className="w-[17%] h-full hover:scale-110 transition:transform"
          onClick={nextHandler}
        >
          <NextButton size={"100%"} fill={"#e8eaed"} />
        </button>
      </span>
      <span className="flex flex-row items-center gap-2 justify-center w-full">
        <span className="flex justify-center items-center text-sm overflow-hidden w-[8%]">
          {formatSongDuration(playerTime.get)}
        </span>

        <span className="grow">
          <SeekBar
            containerStyles={{
              backgroundColor: COLORS.BG,
              borderRadius: "10vw",
            }}
            progressStyles={{
              backgroundColor: COLORS.ACCENT,
              borderRadius: "10vw",
            }}
            height="4px"
            width="100%"
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
        </span>

        <span className="flex justify-center items-center text-sm overflow-hidden w-[8%]">
          {formatSongDuration(data.duration)}
        </span>
      </span>
    </>
  );
}
