/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { SongData } from "./Player";

interface ThumbnailProps {
  songData: SongData;
}

export default function Thumbnail({ songData }: ThumbnailProps) {
  const { vid, owner, playerInfo } = songData;

  return (
    <div className="flex justify-start items-center mix-blend-normal w-[17vw] mx-[1vw]">
      <span className={`flex justify-center w-[6rem] h-[6rem] overflow-hidden`}>
        <img src={vid.thumbnail} className="object-cover rounded-[4px]"></img>
      </span>
    </div>
  );
}
