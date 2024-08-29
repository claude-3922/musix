/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

import { SongData } from "@/util/types/SongData";

interface ThumbnailProps {
  songData: SongData;
}

export default function Thumbnail({ songData }: ThumbnailProps) {
  const { vid } = songData;

  return (
    <div className="flex justify-start items-center">
      <span className={`flex justify-center w-[5vw] h-[5vw] overflow-hidden`}>
        <img src={vid.thumbnail} className="object-cover rounded-[2px]"></img>
      </span>
    </div>
  );
}
