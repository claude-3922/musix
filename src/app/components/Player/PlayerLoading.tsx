/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";

export default function PlayerLoading() {
  return (
    <div
      className={`flex flex-row items-center justify-evenly w-[100vw] h-[14vh] px-[2vw] my-[2vh] mx-[1vw] rounded-[4px] bg-custom_d_gray`}
    >
      <span className="flex items-center justify-center border-4 rounded-xl h-[6rem] w-[6rem]">
        <img
          className="object-fit invert"
          src="/icons/loading.gif"
          width={150}
          height={150}
        ></img>
      </span>
    </div>
  );
}
