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
  previewToggle: boolean;
}

export default function Thumbnail({ songData, previewToggle }: ThumbnailProps) {
  const { vid, owner, playerInfo } = songData;

  return (
    <div className="flex justify-start items-center w-[17vw] mx-[1vw]">
      <span
        className={`flex justify-center items-center w-[6rem] h-[6rem] overflow-hidden`}
      >
        <img
          className="rotate-[270deg]"
          height={28}
          width={28}
          src="/icons/next.svg"
          onClick={() => (previewToggle = previewToggle ? false : true)}
        />
      </span>
      <span className={`flex justify-center w-[6rem] h-[6rem] overflow-hidden`}>
        <img src={vid.thumbnail} className="object-cover rounded-[4px]"></img>
      </span>
    </div>
  );
}
