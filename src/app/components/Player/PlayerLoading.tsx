/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";

export default function PlayerLoading() {
  return (
    <div className="flex items-center justify-between w-[100vw] h-[6vw]">
      <div
        className={`text-white flex flex-row items-center justify-between w-[100vw] h-[6vw] px-[1vw] mx-[1vw] rounded-xl bg-custom_gray/20`}
      >
        <div className="flex justify-center">
          <div className="flex justify-start items-center w-[30vw]">
            <span
              className={`animate-pulse flex justify-center w-[5vw] h-[5vw] bg-black/20 rounded-[4px]`}
            ></span>
            <div className="flex flex-col justify-center items-start">
              <span className="animate-pulse flex items-center justify-start w-[20vw] h-[1vw] mx-[1vw] my-[0.5vw] bg-black/20 rounded-[4px]"></span>
              <span className="animate-pulse flex items-center justify-start w-[10vw] h-[1vw] mx-[1vw] my-[0.5vw] bg-black/20 rounded-[4px]"></span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center h-[6vw]">
            <span className="animate-pulse flex items-center justify-start w-[6vw] h-[2vw] my-[0.25rem] bg-black/20 rounded-[4px]"></span>
            <span className="animate-pulse flex items-center justify-start w-[40vw] h-[1vw] my-[0.25rem] bg-black/20 rounded-[4px]"></span>
          </div>
        </div>

        <div className="flex flex-row justify-end items-center w-[17vw]">
          <span className="animate-pulse flex items-center justify-start w-[12vw] h-[2vw] my-[1vh] bg-black/20 rounded-[4px]"></span>
        </div>
      </div>
    </div>
  );
}
