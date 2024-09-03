/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";

export default function PlayerEmpty() {
  return (
    <div className="flex items-center justify-between w-[100vw] h-[6.07vw]">
      <div
        className={`text-white flex flex-row items-center justify-between w-[100vw] h-[6.07vw] px-[1vw] bg-white/10`}
      >
        <div className="flex justify-center">
          <div className="flex justify-start items-center w-[30vw]">
            <span
              className={`flex justify-center w-[5vw] h-[5vw] bg-black/20 rounded-[4px]`}
            ></span>
            <div className="flex flex-col justify-center items-start ml-[1vw]">
              <h1 className="">Nothing Playing</h1>
              <h1 className="text-sm">-</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
