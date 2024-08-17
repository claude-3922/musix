/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SongData } from "./Player";
import { formatSongDuration } from "@/util/format";

interface InfoProps {
  player: SongData;
  audioPlayer: HTMLAudioElement;
}

export default function Info({ player, audioPlayer }: InfoProps) {
  const { vid } = player;

  const [playing, setPlaying] = useState(false);
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
  };

  audioPlayer.ontimeupdate = () => {
    setAudioTime(audioPlayer.currentTime);

    if (seekBar.current) {
      seekBar.current.value = `${audioPlayer.currentTime}`;
    }
  };

  const handlePaused = () => {
    let videoPlayer = document.getElementById(
      "videoPlayer"
    ) as HTMLVideoElement;

    if (audioPlayer) {
      if (audioPlayer.paused) {
        audioPlayer.play();
        if (videoPlayer) {
          videoPlayer.play();
        }
        setPlaying(true);
      } else {
        audioPlayer.pause();
        if (videoPlayer) {
          videoPlayer.pause();
        }
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (playing) {
      if (playbackButton.current) {
        playbackButton.current.src = "/icons/pauseButton.svg";
      }
    } else {
      if (playbackButton.current) {
        playbackButton.current.src = "/icons/playButton.svg";
      }
    }
  }, [playing]);

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="flex w-[30vw] whitespace-nowrap overflow-hidden justify-center ">
        {vid.title.length > 30 ? (
          <h1 className="flex justify-center text-2xl w-[24vw] animate-[marquee_30s_linear_infinite] transition-transform">
            {vid.title}
          </h1>
        ) : (
          <h1 className="flex justify-center text-2xl w-[24vw]">{vid.title}</h1>
        )}
      </span>
      <span className="flex flex-row items-center justify-start w-[50vw]">
        <span className="flex w-[6vw] overflow-hidden justify-center">
          {formatSongDuration(audioTime)}
        </span>
        <input
          className="w-[40vw]"
          ref={seekBar}
          type="range"
          min={0}
          max={vid.duration}
          step={1}
          onChange={handleSeekChange}
        />
        <span className="flex w-[6vw] overflow-hidden justify-center">
          {formatSongDuration(vid.duration)}
        </span>
      </span>
      <span className="flex flex-row justify-center items-center">
        <button className="border-2">PREVIOUS</button>
        <button onClick={handlePaused}>
          <img
            ref={playbackButton}
            src="/icons/playButton.svg"
            height={64}
            width={64}
          ></img>
        </button>
        <button className="border-2">NEXT</button>
      </span>
    </div>
  );
}
