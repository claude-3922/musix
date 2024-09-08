/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";

import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import OverlayIcon from "../Util/OverlayIcon";
import { PAGE_STATES } from "@/util/enums/pageState";

interface ThumbnailProps {
  songData: SongData;
  pageState: StateManager<PAGE_STATES>;
}

export default function Thumbnail({ songData, pageState }: ThumbnailProps) {
  return (
    <div className="flex justify-start items-center">
      <OverlayIcon
        thumbnailURL={songData.thumbnail}
        width={"5vw"}
        height={"5vw"}
        iconStyle={{
          borderRadius: "4px",
          overflow: "hidden",
        }}
        onClick={() =>
          pageState.set(
            pageState.get === PAGE_STATES.Preview
              ? PAGE_STATES.Main
              : PAGE_STATES.Preview
          )
        }
      >
        <img
          src="/icons/arrow_up.svg"
          style={{
            width: "2vw",
            height: "2vw",
            opacity: 0.8,
            rotate: pageState.get === PAGE_STATES.Preview ? "180deg" : "360deg",
          }}
        />
      </OverlayIcon>
    </div>
  );
}
