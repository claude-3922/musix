/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";

export default function PlayerLoading() {
  return (
    <div
      className={`flex flex-row items-center justify-between w-[100vw] h-[14vh] px-[2vw] my-[2vh] mx-[1vw] rounded-[4px] bg-custom_gray/20`}
    >
      <div className="flex justify-start items-center w-[17vw] mx-[1vw]">
        <span
          className={`animate-pulse flex justify-center w-[6rem] h-[6rem] bg-black/20 rounded-[4px]`}
        ></span>
      </div>

      <div className="flex flex-col justify-center items-center w-[70vw] h-[10vh]">
        <span className="animate-pulse flex w-[30vw] h-[4vh] justify-center bg-black/20 my-[0.25rem] rounded-[4px]"></span>
        <span className="animate-pulse flex items-center justify-start w-[50vw] h-[4vh] my-[0.25rem] bg-black/20 rounded-[4px]"></span>
        <span className="animate-pulse flex items-center justify-start w-[10vw] h-[4vh] my-[0.25rem] bg-black/20 rounded-[4px]"></span>
      </div>

      <div className="flex flex-col justify-center items-center w-[20vw] h-[10vh]">
        <span className="animate-pulse flex items-center justify-start w-[10vw] h-[4vh] my-[1vh] bg-black/20 rounded-[4px]"></span>
      </div>
    </div>
  );
}
