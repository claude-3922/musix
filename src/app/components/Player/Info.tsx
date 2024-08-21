/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ChangeEvent,
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import { SongData } from "./Player";
import { formatSongDuration } from "@/util/format";
import hexRgb from "hex-rgb";
import { pSBC } from "@/util/pSBC";

interface InfoProps {
  player: SongData;
  audioPlayer: HTMLAudioElement;
}

export default function Info({ player, audioPlayer }: InfoProps) {
  const { vid, playerInfo } = player;

  const [playing, setPlaying] = useState(true);
  const [audioTime, setAudioTime] = useState(audioPlayer.currentTime);

  const seekBar = useRef<HTMLInputElement | null>(null);
  const playbackButton = useRef<HTMLImageElement | null>(null);

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

  const lighterAccent = pSBC(0.25, playerInfo.topColor);

  const seekBarStyle = { accentColor: lighterAccent } as CSSProperties;

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="flex w-[30vw] whitespace-nowrap overflow-hidden justify-center ">
        {vid.title.length > 45 ? (
          <h1 className="flex justify-start text-xl w-[30vw] animateTitle">
            {vid.title}
          </h1>
        ) : (
          <h1 className="flex justify-center text-xl w-[30vw]">{vid.title}</h1>
        )}
      </span>
      <span className="flex flex-row items-center justify-start w-[50vw]">
        <span className="flex text-sm w-[5vw] overflow-hidden justify-center">
          {formatSongDuration(audioTime)}
        </span>

        <input
          id="seekBar"
          className="w-[40vw] h-[0.5vh] rounded-[10px] bg-white hover:border-none"
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
      <span className="flex flex-row justify-center items-center my-[0.25rem]">
        <button className="mr-[0.75rem]">
          <img src="/icons/previous.svg" height={28} width={28}></img>
        </button>

        <button
          className="mr-[0.75rem]"
          onClick={() =>
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause()
          }
        >
          <img
            ref={playbackButton}
            src={playing ? `/icons/pauseButton.svg` : `/icons/playButton.svg`}
            height={36}
            width={36}
          ></img>
        </button>
        <button className="mr-[0.75rem]">
          <img src="/icons/next.svg" height={28} width={28}></img>
        </button>
      </span>
    </div>
  );
}
