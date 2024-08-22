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
  togglePreview: (b: boolean) => void;
}

export default function Thumbnail({ songData, togglePreview }: ThumbnailProps) {
  const { vid, owner, playerInfo } = songData;

  const [previewToggled, setPreviewToggled] = useState(false);

  return (
    <div className="flex justify-start items-center w-[17vw] mx-[1vw]">
      <span
        className={`flex justify-center items-center w-[2rem] h-[2rem] overflow-hidden mr-[1vw]`}
      >
        <button
          onClick={() => {
            togglePreview(!previewToggled);
            setPreviewToggled((p) => !p);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="white"
            className="playNoFill"
            viewBox="0 0 16 16"
          >
            {previewToggled ? (
              <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2m6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
            ) : (
              <>
                <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
              </>
            )}
          </svg>
        </button>
      </span>
      <span className={`flex justify-center w-[6rem] h-[6rem] overflow-hidden`}>
        <img src={vid.thumbnail} className="object-cover rounded-[4px]"></img>
      </span>
    </div>
  );
}
