/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import OverlayIcon from "../Util/OverlayIcon";

interface ThumbnailProps {
  songData: SongData;
  previewState: StateManager<boolean>;
}

export default function Thumbnail({ songData, previewState }: ThumbnailProps) {
  const { vid } = songData;

  const [thumbnailOverlay, setThumbnailOverlay] = useState(false);

  return (
    <div className="flex justify-start items-center">
      <OverlayIcon
        thumbnailURL={vid.thumbnail}
        width={"5vw"}
        height={"5vw"}
        iconStyle={{
          borderRadius: "4px",
          overflow: "hidden",
        }}
        onClick={() => previewState.set(!previewState.get)}
      >
        <img
          src="/icons/arrow_up.svg"
          style={{
            width: "2vw",
            height: "2vw",
            opacity: 0.8,
            rotate: previewState.get ? "180deg" : "360deg",
          }}
        />
      </OverlayIcon>
    </div>
  );
}
