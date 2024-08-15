/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export interface PlayerProps {
  vid: {
    id: string;
    url: string;
    title: string;
    thumbnail: {
      main: string;
      alt: string;
    };
  };
  owner: {
    title: string;
    url: string;
    thumbnail: {
      main: string;
      alt: string;
    };
  };
  playerInfo: {
    volume: number;
    loop: boolean;
    vidEnabled: boolean;
  };
}

export function Player({ vid, owner, playerInfo }: PlayerProps) {
  const vidSrc = `/media?id=${vid.id}&vid=1`;

  return (
    <div className="flex flex-row items-center justify-between w-[100vw] h-[10vh]">
      <span className="inline-block w-[16vw] h-[9vh]">
        {playerInfo.vidEnabled ? (
          <video
            className="object-cover rounded-xl"
            src={vidSrc}
            autoPlay
            poster={`${vid.thumbnail.main || vid.thumbnail.alt}`}
            height={200}
            width={200}
          />
        ) : (
          <img
            className="object-cover rounded-xl"
            alt="Thumbnail"
            src={`${vid.thumbnail.main || vid.thumbnail.alt}`}
            height={200}
            width={200}
          />
        )}
      </span>
      <span>TEST</span>
      <span>TEST</span>
      <span>TEST</span>
    </div>
  );
}
