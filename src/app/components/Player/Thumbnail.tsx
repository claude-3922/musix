/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ForwardedRef, forwardRef, useRef } from "react";
import { SongData } from "./Player";

interface ThumbnailProps {
  songData: SongData;
  audioPlayer: HTMLAudioElement;
}

export default function Thumbnail({ songData, audioPlayer }: ThumbnailProps) {
  const { vid, owner, playerInfo } = songData;
  const vidSrc = `/media?id=${vid.id}&vid=1`;

  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  audioPlayer.ontimeupdate = () => {
    if (videoPlayer.current) {
      if (
        Math.abs(audioPlayer.currentTime - videoPlayer.current.currentTime) >=
        0.25
      ) {
        videoPlayer.current.currentTime = audioPlayer.currentTime;
        console.log("Video time changed");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mix-blend-normal">
      <span
        className={`flex justify-center w-[12.25rem] h-[8rem] overflow-hidden`}
      >
        {playerInfo.vidEnabled ? (
          <video
            autoPlay
            id="videoPlayer"
            ref={playerInfo.vidEnabled ? videoPlayer : null}
            className="object-cover rounded-[4px]"
            src={vidSrc}
            poster={`${vid.thumbnail.main || vid.thumbnail.alt}`}
            onPlay={() => {
              if (videoPlayer.current) {
                videoPlayer.current.currentTime = audioPlayer.currentTime;
              }
            }}
          />
        ) : (
          <img
            src={vid.thumbnail.main || vid.thumbnail.alt}
            className="object-cover rounded-[4px]"
          ></img>
        )}
      </span>
    </div>
  );
}
