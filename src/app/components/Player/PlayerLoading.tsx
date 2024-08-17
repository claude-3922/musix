/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";

export default function PlayerLoading() {
  return (
    <span className="absolute left-[45vw] bottom-[45vh] z-1">
      <span className="flex items-center justify-center border-4 rounded-xl h-[6rem] w-[6rem]">
        <img
          className="object-fit invert"
          src="/icons/loading.gif"
          width={150}
          height={150}
        ></img>
      </span>
    </span>
  );
}
