/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";

interface ThumbnailProps {
  songData: SongData;
  previewState: StateManager<boolean>;
}

export default function Thumbnail({ songData, previewState }: ThumbnailProps) {
  const { vid } = songData;

  const [thumbnailOverlay, setThumbnailOverlay] = useState(false);

  return (
    <div className="flex justify-start items-center">
      <span
        className={`relative flex justify-center w-[5vw] h-[5vw] overflow-hidden hover:cursor-pointer`}
        onMouseOver={() => setThumbnailOverlay(true)}
        onMouseOut={() => setThumbnailOverlay(false)}
        onClick={() => previewState.set(!previewState.get)}
      >
        <img src={vid.thumbnail} className="object-cover rounded-[2px]" />
        {thumbnailOverlay && (
          <span className="absolute z-[1] w-[5vw] h-[5vw] bg-black/50">
            <img
              className="absolute z-[2] top-[31.25%] left-[31.25%] opacity-[75%] w-[2vw] h-[2vw]"
              src={"/icons/arrow_up.svg"}
              style={{
                rotate: previewState.get ? "180deg" : "360deg",
              }}
            />
          </span>
        )}
      </span>
    </div>
  );
}
