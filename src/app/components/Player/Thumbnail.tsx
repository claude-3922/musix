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

import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";

interface ThumbnailProps {
  songData: SongData;
}

export default function Thumbnail({ songData }: ThumbnailProps) {
  const { vid, owner, playerInfo } = songData;

  const lighterAccent = pSBC(0.1, playerInfo.topColor);

  return (
    <div className="flex justify-start items-center">
      <span className={`flex justify-center w-[5vw] h-[5vw] overflow-hidden`}>
        <img src={vid.thumbnail} className="object-cover rounded-[2px]"></img>
      </span>
    </div>
  );
}
